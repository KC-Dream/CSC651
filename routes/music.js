const express = require('express');
const router = express.Router();

router.get("/music", function(req, res) {
    
    res.render("music");
});

module.exports = router;