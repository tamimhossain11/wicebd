const db = require('../db');

const getAnalytics = async (req, res) => {
  try {
    // Total counts
    const [[{ totalProject }]] = await db.query('SELECT COUNT(*) as totalProject FROM registrations');
    const [[{ totalOlympiad }]] = await db.query('SELECT COUNT(*) as totalOlympiad FROM olympiad_registrations');
    const [[{ totalRoboSoccer }]] = await db.query('SELECT COUNT(*) as totalRoboSoccer FROM robo_soccer_registrations');
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalAnnouncements }]] = await db.query('SELECT COUNT(*) as totalAnnouncements FROM announcements WHERE is_published = 1');

    // Daily registrations last 14 days (project)
    const [projectDaily] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM registrations
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Daily registrations last 14 days (olympiad)
    const [olympiadDaily] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM olympiad_registrations
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Daily registrations last 14 days (robo soccer)
    const [roboDaily] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM robo_soccer_registrations
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Competition category breakdown for project
    const [categoryBreakdown] = await db.query(`
      SELECT competitionCategory as category, COUNT(*) as count
      FROM registrations
      GROUP BY competitionCategory
      ORDER BY count DESC
    `);

    // New users last 7 days
    const [userGrowth] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      totals: {
        project: totalProject,
        olympiad: totalOlympiad,
        roboSoccer: totalRoboSoccer,
        users: totalUsers,
        announcements: totalAnnouncements,
        all: totalProject + totalOlympiad + totalRoboSoccer,
      },
      charts: {
        projectDaily,
        olympiadDaily,
        roboDaily,
        categoryBreakdown,
        userGrowth,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

module.exports = { getAnalytics };
