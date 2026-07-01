exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  req.flash('error_msg', 'Silakan login terlebih dahulu');
  res.redirect('/login');
};

exports.isRole = (roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash('error_msg', 'Silakan login terlebih dahulu');
      return res.redirect('/login');
    }
    if (!roles.includes(req.session.user.role)) {
      req.flash('error_msg', 'Anda tidak memiliki akses ke halaman ini');
      return res.redirect('/dashboard');
    }
    next();
  };
};
