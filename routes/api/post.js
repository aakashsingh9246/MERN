const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/Users');
const Profile = require('../../models/Profile');

//post request to create a post private

router.post('/',[auth,
	[
	check('text', 'Text is required').not().isEmpty(),
	]
	], async (req,res)=> {
		const errors = validationResult(req);
		if (!errors.isEmpty()){
			return res.status(400).json({msg: errors.array()})
		}

		try{
			const user = await User.findById(req.user.id).select('-password');
			const newPost = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id
		})
			const post = await newPost.save()
			res.json(post);

		}catch(err){
			console.err(err.message);
			res.status(500).send('Server Error!')
		}
});

// get req api/post get all post private

router.get('/',auth, async (req,res)=>{
	try{
		const posts = await Post.find().sort({date: -1 });
		res.json(posts);

	}catch(err){
		console.error(err.message);
		res.status(500).send('Server Error!')
	}
});

//get post by id

router.get('/:id',auth, async (req,res)=>{
	try{
		const post = await Post.findById(req.params.id);
		if (!post){
			return res.status(404).json({msg: "Post not found"});
		}

		res.json(post);

	}catch(err){
		console.error(err.message);
		if (err.kind == "ObjectId"){
			return res.status(404).json({msg: "Post not found"});
		}
		res.status(500).send('Server Error!')
	}
});

//delete post by id

router.delete('/:id',auth, async (req,res)=>{
	try{
		const post = await Post.findById(req.params.id);
		if (!post){
			return res.status(404).json({msg: "Post not found"});
		}

		//check on user
		if (post.user.toString() !== req.user.id){
			return res.status(401).json({msg: 'Not Authorized user!'});
		}

		await post.remove();
		res.json({msg: 'Post removed!'});

	}catch(err){
		console.error(err.message);
		if (err.kind == "ObjectId"){
			return res.status(404).json({msg: "Post not found"});
		}
		res.status(500).send('Server Error!')
	}
});

//add like

router.put('/like/:id',auth,async (req,res)=>{

	try{
		const post = await Post.findById(req.params.id);
		if (!post){
			return res.status(404).json({msg: "Post not found"});
		}

		//if already liked
		if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
			return res.status(400).json({msg: 'this post is alredy liked'})
		}

		post.likes.unshift({user: req.user.id});
		await post.save();
		res.json(post.likes)

	}catch(err){
		console.error(err.message);
		if (err.kind == "ObjectId"){
			return res.status(404).json({msg: "Post not found"});
		}
		res.status(500).send('Server Error!')
	}


});

//add unlike

router.put('/unlike/:id',auth,async (req,res)=>{

	try{
		const post = await Post.findById(req.params.id);
		if (!post){
			return res.status(404).json({msg: "Post not found"});
		}

		//if not liked
		if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
			return res.status(400).json({msg: 'this post has not been liked bu you'})
		}
		const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
		post.likes.splice(removeIndex, 1);
		await post.save();
		res.json(post.likes);

	}catch(err){
		console.error(err.message);
		if (err.kind == "ObjectId"){
			return res.status(404).json({msg: "Post not found"});
		}
		res.status(500).send('Server Error!')
	}


});

//add comment

router.post('/comment/:id',[auth,
	[
	check('text', 'Text is required').not().isEmpty(),
	]
	], async (req,res)=> {
		const errors = validationResult(req);
		if (!errors.isEmpty()){
			return res.status(400).json({msg: errors.array()})
		}

		try{
			const user = await User.findById(req.user.id).select('-password');
			const post = await Post.findById(req.params.id)
			if (!post){
			return res.status(404).json({msg: "Post not found"});
			}

			const newComment = {
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id
		}
			post.comments.unshift(newComment);


			await post.save()
			res.json(post.comments);

		}catch(err){
			console.error(err.message);
			if (err.kind == "ObjectId"){
			return res.status(404).json({msg: "Post not found"});
			}
			res.status(500).send('Server Error!')
		}
});

// delete comment with comment id

router.delete('/comment/:post_id/:comment_id',auth, async (req,res)=>{
	try{

		const post = await Post.findById(req.params.post_id)
		if (!post){
			return res.status(404).json({msg: "Post not found"});
		}

		const comment = post.comments.find(comment => comment.id === req.params.comment_id)
		if (comment.user.toString() !== req.user.id){
			return res.status(401).json({msg: 'Not authorized user'});
		}

		const removeIndex = post.comments.map(entry => entry.user.toString()).indexOf(req.params.comment_id)
		
		post.comments.splice(removeIndex, 1)
		await post.save()
		res.json(post.comments);

	}catch(err){
		console.error(err.message);
		if (err.kind == "ObjectId"){
			return res.status(404).json({msg: "Post not found"});
		}
		res.status(500).send('Server Error!')
	}
})

module.exports = router;