require("dotenv").config();

const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require("mongoose"),
  cors = require("cors"),
  routes = require("./routes/index"),
  errHandler = require("./middlewares/errHandler"),
  morgan = require("morgan"),
  kue = require("kue"),
  queue = kue.createQueue(),
  User = require("./models/user"),
  Question = require("./models/question"),
  nodemailer = require("nodemailer"),
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.GOOGLE_EMAIL}`,
      pass: `${process.env.GOOGLE_PASS}`
    }
  });

app.use(cors());
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(express.json({ limit: "2mb" }));

let DB_TARGET = "";
if (process.env.NODE_ENV == "prod") {
} else {
  DB_TARGET = process.env.MONGODB_ATLAS;
  // DB_TARGET = process.env.MONGODB_LOCAL + "-" + process.env.NODE_ENV;
}

mongoose
  .connect(DB_TARGET, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Database:", DB_TARGET);
  })
  .catch(err => {
    console.log("error");
  });

app.use("/", routes);
app.use(errHandler);
app.use("/kue-ui", kue.app);

app.listen(port, () => {
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Port:", port);
});

// CRON JOB, KUE / BACKGROUND JOBS, DAN NODE MAILER
var cron = require("node-cron");

var task = cron.schedule(
  "0 8 * * 1", //tiap senin jam 8 pagi kirimin question of the week, yaitu question yang paling dapat banyak like di semua periode
  () => {
    Question.find({})
      .populate("userId")
      .then(questions => {
        let result = questions.sort(function(a, b) {
          return b.upvotes.length - a.upvotes.length;
        });
        let q_otw = result[0];
        let emailCont = `
        this is the question of the week : <br>
        <hr>
        <h1>${q_otw.title}</h1><br>
        <small> by : ${q_otw.userId.username}</small>
        <p>${q_otw.description}</p>
        <p>${q_otw.upvotes.length} people upvoted this</p>
        <p>created at: ${new Date(q_otw.createdAt)}</p>
        <a href="http://noviirna-overflow.com/question/${
          q_otw._id
        }">Checkout this question at our site!</a>
      `;
        User.find({})
          .then(founds => {
            founds.forEach(user => {
              const mailOptions = {
                from: "info@noviirna-overflow.site", // sender address
                to: `${user.email}`, // list of receivers
                subject: `Question Of The Week - ${new Date().toISOString}`, // Subject line
                html: emailCont
              };
              transporter
                .sendMail(mailOptions)
                .then(sent => {
                  var qotw_job = queue
                    .create("qotw", {
                      title: `QOTW email on monday at 8.00 am sent to ${
                        user.email
                      }"`
                    })
                    .save(err => {
                      if (err) {
                        console.log(err);
                      }
                    });
                })
                .catch(err => {
                  console.log(err);
                });
            });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
    console.log("EMAIL SENT TO ALL USER");
  },
  { timezone: "Asia/Jakarta" }
);

task.start();

queue.process("qotw", (job, done) => {
  done();
});
