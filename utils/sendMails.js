const nodemailer=require('nodemailer')

const sendEmail=async (options)=>{
    const transport = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    // verify connection configuration
    transport.verify(function (error, success) {
        if (error) {
        console.log(error);
        } else {
        console.log("Server is ready to take our messages");
        }
    });
  

    const emailOptions={
        from:"rohan.ms@tourdb.com",
        to:options.email,
        subject:options.subject,
        html:options.message
    }

    
    return transport.sendMail(emailOptions)
}

module.exports=sendEmail