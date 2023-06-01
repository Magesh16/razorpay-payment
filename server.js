import express from 'express';
import razorpay from 'razorpay';
import cors from 'cors';
import shortid from 'shortid';
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';
import { log } from 'console';
const app =express();

dotenv.config();

app.use(express.json());
app.use(cors({
    origin:'*'
}))

var instance = new razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECRET_ID,
});

app.post('/verification', (req,res)=>{
  const secret = '16062002';
	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')


	if (digest === req.headers['x-razorpay-signature']) {
		console.log("request is ok");
		fs.writeFileSync('payment.json', JSON.stringify(req.body, null, 4))
	} else {
	}
  res.json({status:'ok'});
})

app.post('/payment', async(req,res)=>{
  const payment_capture = 1
	const amount = 4500
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await instance.orders.create(options)
		// console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})

app.listen(1315, ()=>{
    console.log("server running at 1315");
})