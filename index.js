const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://TavoAdmin:fmwvls4ZQXCX26ik@cluster0.tnetvvs.mongodb.net/fifapp");
const {model : TeamModel, schema : TeamSchema} = require("./models/team");
const {model : PlayerModel, schema : PlayerSchema} = require("./models/player");
const basicAuth = require('./sessionController');

const bodyParser = require("body-parser");
const { send } = require("express/lib/response");
app.use(bodyParser.json());

app.use(basicAuth);


app.post('/team', function (req, res) {
  const team = new TeamModel();

  team.name = req.body.name;
  team.description = req.body.description;
  if (team.name && team.description) {
    team.save(function (err) {
      if (err) {
        res.status(422);
        console.log('error while saving the team', err);
        res.json({
          error: 'There was an error saving the team'
        });
      }
      res.status(201);//CREATED
      res.header({
        'location': `http://localhost:3000/team/?id=${team.id}`
      });
      res.json(team);
    });
  } else {
    res.status(422);
    console.log('error while saving the team')
    res.json({
      error: 'No valid data provided for team'
    });
  }
});

app.get('/team', function(req, res){
  TeamModel.find({},function(err,teams){
    if(err){
      res.send({Error: err})
    }
    res.json(teams)
  })
});

app.patch('/team',function(req,res){
  TeamModel.findByIdAndUpdate(req.query.id,{name:req.body.name, description:req.body.description}, {new:true},(err,teamUpdated)=>{
    if(err){
      res.send({error : err})
    }
    res.status(200).send(teamUpdated)
  })
});

app.delete('/team',function(req,res){
  TeamModel.findByIdAndDelete(req.query.id,(err,teamDeleted)=>{
    if(err){
      res.send({Error: err})
    }
    res.send(teamDeleted).status(204)
  })
});

app.post('/player',(req,res)=>{
  const player = new PlayerModel();

  player.firstName = req.body.firstName;
  player.lastName = req.body.lastName;
  player.age = req.body.age;
  player.team = req.body.team;
  if (player.firstName && player.lastName && player.age && player.team) {
    TeamModel.findById(player.team,(err,teamFound)=>{
      if(err){player.team = null;}else{player.team = teamFound._id;}
      player.save(function (err) {
      if (err) {
        res.status(422);
        console.log('error while saving the player', err);
        res.json({
          error: 'There was an error saving the player'
        });
      }
      res.status(201);//CREATED
      res.json(player);
    });
    })
  } else {
    res.status(422);
    console.log('error while saving the player')
    res.json({
      error: 'No valid data provided for player'
    });
  }
});

app.get('/player',(req,res)=>{
  PlayerModel.find({},(err,players)=>{
    if(err){res.status(404).send({Error:err})}
    res.json(players)
  })
});

app.delete('/player',(req,res)=>{
  PlayerModel.findByIdAndDelete(req.query.id,(err,playerDeleted)=>{
    if(err){
      res.send({Error: err})
    }
    res.send(playerDeleted).status(204)
  })
});

app.patch('/player',(req,res)=>{
  PlayerModel.findByIdAndUpdate(req.query.id,
    {
      firstName:req.body.firstName, 
      lastName:req.body.lastName, 
      age:req.body.age,
      team:req.body.team
    }, 
    {new:true},(err,teamUpdated)=>{
    if(err){
      res.send({error : err})
    }
    res.status(200).send(teamUpdated)
  })
});

app.listen(3000, () => console.log(`Fifa app listening on port 3000!`))

