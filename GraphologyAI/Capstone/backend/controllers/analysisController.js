const analysisService = require("../services/analysisService");
const pdfService = require("../services/pdfService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");

// @route   POST /api/analysis/upload
// @desc    Upload dan analyze image
// @access  Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  let imageData;
  if (req.body.imageData && typeof req.body.imageData === 'string' && req.body.imageData.startsWith('data:image')) {
    imageData = req.body.imageData;
  } else {
    imageData = req.file ? req.file.path : req.body.imageData;
  }

  if (!imageData) {
    return next(new AppError("Image data required", 400));
  }

  const analysis = await analysisService.analyzeHandwriting(
    userId,
    imageData,
    "image"
  );

  res.status(201).json({
    message: "Analysis completed successfully",
    analysis,
  });
});

// @route   GET /api/analysis/:analysisId/pdf
// @desc    Download Analysis PDF
// @access  Private
exports.generatePDF = asyncHandler(async (req, res, next) => {
  const { analysisId } = req.params;
  const analysis = await analysisService.getAnalysis(analysisId);

  if (!analysis) {
    return next(new AppError("Analysis not found", 404));
  }

  const filename = `Analysis_Result_${analysisId}.pdf`;
  res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-type", "application/pdf");

  await pdfService.generateReport(analysis, res);
});

// @route   POST /api/analysis/canvas
// @desc    Analyze canvas drawing
// @access  Private
exports.analyzeCanvas = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { canvasData } = req.body;

  if (!canvasData) {
    return next(new AppError("Canvas data required", 400));
  }

  const analysis = await analysisService.analyzeHandwriting(
    userId,
    canvasData,
    "canvas"
  );

  res.status(201).json({
    message: "Analysis completed successfully",
    analysis,
  });
});

// @route   PUT /api/analysis/:analysisId/validation
// @desc    Save questionnaire validation results for analysis
// @access  Private
exports.saveValidationResult = asyncHandler(async (req, res, next) => {
  const { analysisId } = req.params;
  const userId = req.user._id;
  const { answers, triadScores } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return next(new AppError("Answers are required", 400));
  }

  const saved = await analysisService.saveValidationResult(analysisId, userId, { answers, triadScores });
  if (!saved) {
    return next(new AppError("Analysis not found or unauthorized", 404));
  }

  res.status(200).json({ message: "Validation results saved successfully", analysis: saved });
});

// @route   GET /api/analysis/:analysisId
// @desc    Get single analysis result
// @access  Private
exports.getAnalysis = asyncHandler(async (req, res, next) => {
  const { analysisId } = req.params;
  const analysis = await analysisService.getAnalysis(analysisId);

  if (!analysis) {
    return next(new AppError("Analysis not found", 404));
  }

  res.status(200).json(analysis);
});

// @route   GET /api/analysis/history/:userId
// @desc    Get user's analysis history
// @access  Private
exports.getUserHistory = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const history = await analysisService.getUserAnalysisHistory(
    userId,
    parseInt(page),
    parseInt(limit)
  );

  res.status(200).json(history);
});

// @route   DELETE /api/analysis/:analysisId
// @desc    Delete analysis
// @access  Private
exports.deleteAnalysis = asyncHandler(async (req, res, next) => {
  const { analysisId } = req.params;

  const deleted = await analysisService.deleteAnalysis(analysisId);
  if (!deleted) {
    return next(new AppError("Analysis not found", 404));
  }

  res.status(200).json({ message: "Analysis deleted successfully" });
});

// @route   PUT /api/analysis/:analysisId
// @desc    Update user's analysis (admin only)
// @access  Private/Admin
exports.updateAnalysis = asyncHandler(async (req, res, next) => {
  const { analysisId } = req.params;
  const { enneagramType, confidence, personalityType } = req.body;

  const updated = await analysisService.updateAnalysis(analysisId, {
    enneagramType,
    confidence,
    personalityType
  });

  if (!updated) {
    return next(new AppError("Analysis not found", 404));
  }

  res.status(200).json({ message: "Analysis updated successfully", analysis: updated });
});

// @route   GET /api/admin/analyses
// @desc    Get all analyses (admin only)
// @access  Private/Admin
exports.getAllAnalyses = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  const analyses = await analysisService.getAllAnalyses(
    parseInt(page),
    parseInt(limit)
  );

  res.status(200).json(analyses);
});

// @route   GET /api/admin/analysis-stats
// @desc    Get analysis statistics (admin only)
// @access  Private/Admin
exports.getStatistics = asyncHandler(async (req, res, next) => {
  const stats = await analysisService.getStatistics();
  res.status(200).json(stats);
});
