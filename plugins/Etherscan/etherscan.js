const request = require('request');
const Discord = require("discord.js");
const schedule = require('node-schedule');



exports.commands = [
	"raised", "watch"
]

var AuthDetails = require("../../auth.json");

exports.raised = {
	usage: 'raised',
			description: 'show the progress of the (pre-)ICO',
	process: function(bot,msg) {

		var requestUrl = 'https://api.etherscan.io/api?module=account&action=balance&address=' + AuthDetails.ico_contract_address + '&tag=latest&apikey=' + AuthDetails.etherscan_api_key;

		request.get(requestUrl, function (err, response, body) {
			try {
				var balance = JSON.parse(body).result;

				var ethereum = balance / 1000000000000000000;

				var tokenRate = 5000;
				var tokensSold = ethereum * tokenRate;
				var round1Sold = tokensSold;

				var tokensAvailable = 40000000;
				var presSaleSold = 1139167;

				var currentPrice = 0.18;

				tokensSold += presSaleSold;
				tokensAvailable += presSaleSold;
				var progress = tokensSold * 100 / tokensAvailable;

				ethereum += 113.916736946883;



				var valueEmbed = new Discord.RichEmbed()
					.setAuthor("I C O", "https://erotix.io/assets/img/logo_28_28.png", "https://etherscan.io/address/"+AuthDetails.ico_contract_address)
					// .setDescription(responseMsg)
					.setColor(0x3b99d9)
					.setTimestamp();
				valueEmbed.addField("ETH Raised", ethereum.toFixed(2), true);
				valueEmbed.addField("Tokens Sold", tokensSold.toFixed(0), true);
				valueEmbed.addField("Current Price", "$" + currentPrice);
				valueEmbed.addField("Progress", "Presale\n" + "*ERX sold: 1.139.167*\n\n" + "Round 1\n" + "*ERX sold: " + round1Sold.toFixed(0) +"/10.000.000*" , true);
				msg.channel.sendEmbed(valueEmbed);
			} catch (e) {
				var valueEmbed = new Discord.RichEmbed()
					.setAuthor("I C O", "https://erotix.io/assets/img/logo_28_28.png", "https://etherscan.io/address/" + AuthDetails.ico_contract_address)
					// .setDescription(responseMsg)
					.setColor(0x3b99d9)
					.setTimestamp();
				valueEmbed.addField("API:", 'Unavailable', true);
				msg.channel.sendEmbed(valueEmbed);
			}


		});
	}
};


exports.watch = {
	usage: 'watch',
	description: 'Posts updates if a new transaction has come in.',
	process: function(bot,msg) {

		var requestUrl = 'https://api.etherscan.io/api?module=account&action=balance&address=' + AuthDetails.ico_contract_address + '&tag=latest&apikey=' + AuthDetails.etherscan_api_key;

		request.get(requestUrl, function (err, response, body) {
			try {
				var balance = JSON.parse(body).result;
				var ethereum = balance / 1000000000000000000;

				var tokenRate = 5000;
				var tokensSold = ethereum * tokenRate
				var tokensAvailable = 40000000;
				var progress = tokensSold * 100 / tokensAvailable

				var x = schedule.scheduleJob('*/10 * * * * *', function () {
					console.log('Watching etherscan');
					request.get(requestUrl, function (err, response, body) {
						try {
							var newBalance = JSON.parse(body).result;
							var newEthereum = newBalance / 1000000000000000000;
							console.log(ethereum+':'+newEthereum);

							if (newEthereum != ethereum) {
								console.log('I DIFFER');
								var ethereumDiff = newEthereum - ethereum;
								var newTokensSold = ethereumDiff * tokenRate;
								ethereum = newEthereum;

								var valueEmbed = new Discord.RichEmbed()
									.setAuthor("I C O - N E W  B U Y  O R D E R", "https://erotix.io/assets/img/logo_28_28.png", "https://etherscan.io/address/" + AuthDetails.ico_contract_address)
									// .setDescription(responseMsg)
									.setColor(0x3b99d9)
									.setTimestamp();
								valueEmbed.addField("ETH Contributed", ethereumDiff.toFixed(2), true);
								valueEmbed.addField("Tokens Bought", newTokensSold.toFixed(0), true);
								msg.channel.sendEmbed(valueEmbed);
							}
						} catch (e) {
						}
					});

				});
			} catch (e) {
			}
		});

		var requestUrl = 'https://api.etherscan.io/api?module=account&action=balance&address=' + AuthDetails.presale_contract_address + '&tag=latest&apikey=' + AuthDetails.etherscan_api_key;
	}
};