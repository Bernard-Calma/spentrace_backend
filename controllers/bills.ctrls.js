const db = require("../models")

const getIntervals = (startDate, interval, endDate) => {
    // Calculate milliseconds in a year
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365;
    // Get multiple due dates from starting date, interval and end date
    // let changingDueDate = startDate
    // Array that will contains all due dates that included on repeat

    // Get total miliseconds of dates
    const parseStartDate = Date.parse(startDate)
    const parseEndDate = Date.parse(endDate)
    let changingDueDate = parseStartDate

    const dueDateArray = []
    switch(interval){
        case "every week":
            while(changingDueDate <= parseEndDate) {
                // console.log(new Date(changingDueDate));
                dueDateArray.push(new Date(changingDueDate));
                changingDueDate += day * 7;
            }
            return dueDateArray
        case "every 2 weeks":
            while(changingDueDate <= parseEndDate) {
                // console.log(new Date(changingDueDate));
                dueDateArray.push(new Date(changingDueDate));
                changingDueDate += day * 14;
            }
            return dueDateArray
        case "every month":
            var changingDate = startDate
            var dateIndex = startDate.getMonth()
            while (dateIndex <= endDate.getMonth()) {
                dueDateArray.push(new Date(changingDate.setMonth(dateIndex)))
                dateIndex += 1
            }
            return dueDateArray
        case "every 2 months":
            var changingDate = startDate
            var dateIndex = startDate.getMonth()
            while (dateIndex <= endDate.getMonth()) {
                dueDateArray.push(new Date(changingDate.setMonth(dateIndex)))
                dateIndex += 2
            }
            return dueDateArray
        default:
            break;
    }
}

const setPaidIntervals = (dueDates) => {
    // Add array of paid boolean status for every due date created in interval
    const paidArray = [];
    for (i in dueDates) {
        paidArray.push(false)
    }
    return paidArray;
}

const handleDueDateChange = (body, route = "Add") => {
        // Get Due Date Array
        const dueDates = getIntervals(new Date(body.dueDate), body.repeat, new Date(body.endRepeat))
        // Assign Paid Status on each due date index
        let paidStatus = []
        if (route === "Add") {
            paidStatus = setPaidIntervals(dueDates)
        } else {
            paidStatus = body.paid
        }
        // Return new edited bill with due date and paid array
        return {...body,
            dueDate: dueDates,
            paid: paidStatus,
            amount: Number(body.amount)
        }
}

// ROUTES
const index = (req, res) => {
    // Grab session currentUser and use the ID to get all bills registered to user
    // console.log("Bills Route Index called");
    // console.log(req.session.id)
    db.Users.findOne({username: req.session.passport.user}, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundUser._id)
            db.Bills.find({user: foundUser._id}, (err, foundBills) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log(foundPlans)
                    res.status(200).json(foundBills)
                }
            })
        }
    })
}

const create = (req, res) => {
    // console.log("Add bill called");
    // Get Due Date
    // GET Repeat Interval
    // Get End Repeat
    // Create monthly due date array until end repeat
    // Create paid array on index of monthly due date array
    // All functions are on top
    const newBill = handleDueDateChange(req.body)
    // console.log("New Bill: ", newBill)
    // console.log(req.body)
    // res.send(newBill)
    db.Users.findOne({username: req.session.passport.user}, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundUser._id)
            db.Bills.create({...newBill, user: foundUser._id}, (err, createdBill) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log(createdBill)
                    res.status(200).json(createdBill)
                }
            })
        }
    })
}

const destroy = (req, res) => {
    // console.log("Delete Route Called")
    db.Bills.findByIdAndDelete(req.params.id, (err, deletedBIll) => {
        try {
            if (err) return (res.status(400).json({error: err.message}))
            console.log("Successfully Deleted", deletedBIll._id)
            return res.status(200).json(deletedBIll)
        } catch {
            return res.status(200).json(deletedBIll)
        }
    })
}

const edit = (req, res) => {
    // console.log("Edit Bill Called: ")
    // console.log(req.body)
    const billToEdit = handleDueDateChange(req.body, "Edit")
    // console.log(billToEdit)
    db.Bills.findByIdAndUpdate(req.params.id, 
        {
            $set: billToEdit,
        }, 
        {
            new: true,
        }, 
        (err, editedBill) => {
        try {
            if (err) return (res.status(400).json({error: err.message}))
            console.log("Successfully Edited", editedBill)
            return res.status(200).json(editedBill)
        } catch {
            return res.status(200).json(editedBill)
        }
    })
}

module.exports = {
    index,
    create,
    destroy,
    edit
}