const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const server = express()
const port = 3000

const nodemailer = require('nodemailer')

server.use(cors())
server.use(bodyParser.json())

server.post('/send', (req, res) => {
  let contactInfo = req.body
  let errors = {}

  if (!contactInfo.name) { errors.name = '* Your name is required' }
  if (!contactInfo.email) { errors.email = '* Your email is required' }
  if (!contactInfo.subject) { errors.subject = '* Please enter a subject' }
  if (!contactInfo.text) { errors.text = '* Your message or project description' }

  let validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!validEmail.test(String(contactInfo.email).toLowerCase())) { errors.email = '* Enter valid email address' }

  if(Object.keys(errors).length > 0) {
    res.status(400).json(errors)
  } else {
    const text = `
      Message: ${contactInfo.text}\n
      Budget:${contactInfo.budget || '---'}\n
      Deadline:${contactInfo.deadline || '---'}\n
      From:${contactInfo.name} <${contactInfo.email}>
    `

    const html = `
      <p>${contactInfo.text}</p>
      <p><strong>Budget:</strong> ${contactInfo.budget || '---'}</p>
      <p><strong>Deadline:</strong> ${contactInfo.deadline || '---'}</p>
      <hr />
      <p><strong>From:</strong> ${contactInfo.name} <strong><</strong> ${contactInfo.email} <strong>></strong></p>
    `

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'emailaddress@smtp.com',
        pass: 'password'
      }
    })

    const mailOptions = {
      from: `${contactInfo.name} <emailaddress@smtp.com>`,
      replyTo: contactInfo.email,
      to: 'emailaddress@smtp.com',
      subject: `[LH] ${contactInfo.subject}`,
      text: text,
      html: html
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })

    res.status(200).json({success: true})
  }
})

server.listen(port, console.log(`Express started at http://localhost:${port}`))
