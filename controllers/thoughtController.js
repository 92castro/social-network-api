const { thought, user } = require("../models");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    thought
      .find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    thought
      .findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    thought
      .create(req.body)
      .then((thought) => {
        return user.findOneAndUpdate(
          { username: req.body.username },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Delete a thought
  deleteThought(req, res) {
    thought
      .findOneAndDelete({ _id: req.params.thoughtId })
      .then(() =>
        user.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        )
      )
      .then(() => res.json({ message: "thought deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    thought
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Add an assignment to a student
  addReaction(req, res) {
    thought
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      )
      .then((reaction) => res.json(reaction))
      .catch((err) => res.status(500).json(err));
  },
  // Remove assignment from a student
  removeReaction(req, res) {
    thought
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: req.body } },
        { runValidators: true, new: true }
      )
      .then((reaction) => res.json(reaction))
      .catch((err) => res.status(500).json(err));
  },
};
