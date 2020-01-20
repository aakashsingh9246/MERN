const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req,res,next)=>{
	//get the token from the header
	const token = req.header('x-auth-token');

	//check if no token 
	if (!token){
	return	res.status(401).json({mgs:"No token, authorization denied."});
	}

	//verify token
	try{
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		req.user = decoded.user;
		next()
	}catch(err){
		res.status(401).json({msg:'Token is not valid'});
	}
}