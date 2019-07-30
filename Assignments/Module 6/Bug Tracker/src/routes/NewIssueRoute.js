import express from 'express';
const newIssueRouter = express.Router();

function router(){
    newIssueRouter.route('/').get((req, res) => {
        res.render('newIssue');
    });

    return newIssueRouter;
}

module.exports = router;
