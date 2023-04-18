const db = require("../models")

const getDateYearMonthDay = (dateString) => {
    // console.log(dateString)
    let date = new Date(dateString)
    // console.log(date)
    return {
        year: date.getFullYear(),
        month: date.getUTCMonth(),
        day: date.getUTCDate()
    }
}

const getIntervals = (startDate, interval, endDate) => {
    // Get multiple due dates from starting date, interval and end date
    let changingDueDate = startDate
    // Array that will contains all due dates that included on repeat
    const dueDateArray = []
    switch(interval){
        case "every month":
            // Add due date in array and increase month until end year
            while(changingDueDate.year <= endDate.year) {
                // Add due date in array and increase month until end month
                while(changingDueDate.month <= endDate.month) {
                    dueDateArray.push(changingDueDate)
                    changingDueDate = {...changingDueDate, month: changingDueDate.month + 1}
                    
                }
                changingDueDate.year += 1
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
        paidArray.push("false")
    }
    return paidArray;
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

    // Get Date Year, Month and Date
    const dueDateStart = getDateYearMonthDay(req.body.dueDate);
    // console.log(dueDateStart)
    const endRepeatDate = getDateYearMonthDay(req.body.endRepeat);
    const dueDates = getIntervals(dueDateStart, req.body.repeat, endRepeatDate)
    const paidStatus = setPaidIntervals(dueDates)
    const newBill = {...req.body,
        dueDate: dueDates,
        paid: paidStatus
    }
    console.log("New Bill: ", newBill)
    db.Users.findOne({username: req.session.passport.user}, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundUser._id)
            db.Bills.create({...newBill, user: foundUser._id}, (err, createdBill) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(createdBill)
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
    db.Bills.findByIdAndUpdate(req.params.id, 
        {
            $set: req.body,
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