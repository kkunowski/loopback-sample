module.exports = function(app) {
        console.log("setting default users");
        var User = app.models.User;
		 User.find({"username":"admin"}, function(err, info) {
            if (info.length == 0 || info.role === undefined) { User.create({"username":"admin","password":"admin","email":"admin@admin.com","role":"admin"}, function(err, info) { }); }
			if (err != null) { console.log("error = " + err); }
        });
};
