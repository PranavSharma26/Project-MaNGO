import {newPayment, checkStatus} from './paymentController'
import express from 'express'
import router from 'express'

router.post('/payment', newPayment)
router.post('/status/:txnId', checkStatus)

module.exports = router;