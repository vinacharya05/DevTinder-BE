const cron = require("node-cron");
const { subDays, startOfDay } = require("date-fns");
const connectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule("0 8 * * *", async () => {
   console.log("Cron job executed", new Date());
   // Send email to all the users who recieved requests yesterday
   try {
      const yesterday = subDays(new Date(), 1);
      const yesterdayStart = startOfDay(yesterday);
      const yesterdayEnd = startOfDay(yesterday);

      const pendingRequests = await connectionRequest.find({
        status: "interested",
        createdAt: {
            $gte: yesterdayStart,
            $lt: yesterdayEnd
        }
      }).populate("fromUserId toUserId");

      const listOfEmails = [...new Set(pendingRequests.map(request => request.toUserId.emailId))];

      for (const emailId of listOfEmails) {
        try {
            const response = await sendEmail.run("New frined requests pending for " + emailId, 
                "There are so may friend requests pening. Please login to devtinderofficial.com to accept or reject requests",
                emailId,
                "support@devtinderofficial.com"
            );
            console.log(response);
        } catch(err) {
            console.log("Could not not email ::", err);
        }
      }


   } catch(err) {

     
   }
});