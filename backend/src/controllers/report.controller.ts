import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Report, ReportStatus } from '../models/Report';
import { AuthRequest } from '../middleware/auth';

const reportRepository = AppDataSource.getRepository(Report);

export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const { type, contentId, reason, details } = req.body;
    const userId = req.user!.id;

    const report = new Report();
    report.type = type;
    report.contentId = contentId;
    report.reason = reason;
    report.details = details;
    report.reporterId = userId;
    // report.reporter will be handled by TypeORM via reporterId

    await reportRepository.save(report);

    return res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    console.error('Create report error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    // Only admins should see reports
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { status, type } = req.query;
    const where: any = {};

    if (status) where.status = status;
    if (type) where.type = type;

    const reports = await reportRepository.find({
      where,
      relations: ['reporter'],
      order: { createdAt: 'DESC' },
    });

    return res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const { id } = req.params;
        const { status } = req.body;

        const report = await reportRepository.findOne({ where: { id } });
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        report.status = status;
        if (status === ReportStatus.RESOLVED || status === ReportStatus.DISMISSED) {
            report.resolvedAt = new Date();
            report.resolvedBy = req.user.id;
        }

        await reportRepository.save(report);
        return res.json(report);
    } catch (error) {
        console.error('Update report error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
