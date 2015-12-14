'use strict'

const Slack = require('slack-client')
const slack = new Slack(process.env.SLACK_TOKEN, true, true)

const randomImage = require('unique-random-array')([
  'https://i.gyazo.com/ab2f6e5b30df300b1443f5f3b42fadb9.png',
  'https://i.gyazo.com/a8f2b1196fff4458b4ae35be2d718937.jpg',
  'https://i.gyazo.com/771d6dcbfd6e7fdaddcf492482eed8c5.png',
  'https://i.gyazo.com/d68520338580493203e4aa13a11fefb6.jpg',
  'https://i.gyazo.com/8985fbfb6fe3ab273bf1485bd2c2587f.png'
])

const request = require('request')

slack.on('open', () => {
  console.log(slack.team.name, slack.self.name)
})

slack.on('message', (message) => {
  console.log(message)

  const channel = slack.getChannelGroupOrDMByID(message.channel)
  const user = slack.getUserByID(message.user)
  if (message.type === 'message' && user && (/demo.gyazo.com/).test(message.text)) {
    request.post({
      url: 'https://slack.com/api/files.upload',
      formData: {
        token: process.env.SLACK_TOKEN,
        file: request(randomImage()),
        channels: message.channel
      }
    }, function (err) {
      if (err) {
        console.error(err)
        return
      }
    })
    // channel.postMessage({
    //   username: 'Gyazo',
    //   icon_url: 'https://raw.githubusercontent.com/gyazo/gyazo-chrome-extension/master/icons/gyazo-128.png',
    //   attachments: [
    //     {
    //       fallback: 'image',
    //       image_url: randomImage(),
    //     }
    //   ]
    // })
  }
})

slack.on('error', (err) => {
  console.error(err)
})

slack.login()
