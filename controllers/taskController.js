const Task = require("../models/Task");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

// ------------ CREAR TASCA --------------
function createTask(req, res) {
  const payload = {
    title: req.body.title,
    description: req.body.description || "",
    cost: Number(req.body.cost) || 0,
    hours_estimated: Number(req.body.hours_estimated) || 0,
    image: req.body.image || "",
    imageProvider: req.body.imageProvider || "",
    imagePublicId: req.body.imagePublicId || "",
    user: req.user._id, 
  };

  new Task(payload)
    .save()
    .then((task) => res.status(201).json({ success: true, data: task }))
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
}

// ------------ LLISTAR TASQUES DE L'USUARI --------------
function getAllTasks(req, res) {
  Task.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .exec()
    .then((tasks) => res.json({ success: true, data: tasks }))
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
}

// ------------ OBTENIR TASCA PER ID --------------
function getTaskById(req, res) {
  Task.findOne({ _id: req.params.id, user: req.user._id })
    .exec()
    .then((task) => {
      if (!task)
        return res
          .status(404)
          .json({ success: false, message: "Tasca no trobada" });
      res.json({ success: true, data: task });
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
}

// ------------ ACTUALITZAR TASCA --------------
function updateTask(req, res) {
  const update = { ...req.body };
  delete update.user; 

  Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    update,
    { new: true }
  )
    .exec()
    .then((task) => {
      if (!task)
        return res
          .status(404)
          .json({ success: false, message: "Tasca no trobada" });
      res.json({ success: true, data: task });
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
}

// ------------ ELIMINAR TASCA --------------
function deleteTask(req, res) {
  Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    .exec()
    .then((task) => {
      if (!task)
        return res
          .status(404)
          .json({ success: false, message: "Tasca no trobada" });

      // Imatge local
      if (task.imageProvider === "local" && task.image) {
        const filename = path.basename(task.image);
        const filePath = path.join(__dirname, "..", "uploads", filename);
        fs.unlink(filePath, () => {});
      }

      // Imatge cloudinary
      if (task.imageProvider === "cloud" && task.imagePublicId) {
        cloudinary.uploader.destroy(task.imagePublicId).catch(() => {});
      }

      res.json({ success: true, message: "Tasca eliminada", data: task });
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
}

// ------------ ACTUALITZAR IMATGE --------------
function updateTaskImage(req, res) {
  if (!req.body.image) {
    return res.status(400).json({
      success: false,
      message: "Cal enviar el camp image",
    });
  }

  const update = {
    image: req.body.image,
    imageProvider: req.body.imageProvider || "",
    imagePublicId: req.body.imagePublicId || "",
  };

  Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    update,
    { new: true }
  )
    .exec()
    .then((task) => {
      if (!task)
        return res.status(404).json({ success: false, message: "Tasca no trobada" });
      res.json({ success: true, message: "Imatge actualitzada", data: task });
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
}

// ------------ RESTABLIR IMATGE --------------
function resetTaskImageToDefault(req, res) {
  Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { image: "", imageProvider: "", imagePublicId: "" },
    { new: true }
  )
    .exec()
    .then((task) => {
      if (!task)
        return res.status(404).json({ success: false, message: "Tasca no trobada" });
      res.json({ success: true, message: "Imatge restablerta", data: task });
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
}

// ------------ ESTADÍSTIQUES (PER USUARI) --------------
function getTaskStats(req, res) {
  const filter = { user: req.user._id };

  Promise.all([
    Task.countDocuments(filter),
    Task.countDocuments({ ...filter, completed: true }),
    Task.countDocuments({ ...filter, completed: false }),
  ])
    .then(([total, completed, pending]) => {
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      res.json({
        success: true,
        data: {
          totalTasks: total,
          completedTasks: completed,
          pendingTasks: pending,
          completionRate,
        },
      });
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
}

// ------------ EXPORTS --------------
module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskImage,
  resetTaskImageToDefault,
  getTaskStats,
};
