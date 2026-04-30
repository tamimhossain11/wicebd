const db = require('../db');

const getAnalytics = async (req, res) => {
  try {
    // Total counts
    const [[{ totalProject }]] = await db.query(
      "SELECT COUNT(*) as totalProject FROM registrations WHERE competitionCategory != 'Megazine'"
    );
    const [[{ totalMagazine }]] = await db.query(
      "SELECT COUNT(*) as totalMagazine FROM registrations WHERE competitionCategory = 'Megazine'"
    );
    const [[{ totalOlympiad }]] = await db.query('SELECT COUNT(*) as totalOlympiad FROM olympiad_registrations');
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalAnnouncements }]] = await db.query('SELECT COUNT(*) as totalAnnouncements FROM announcements WHERE is_published = 1');

    // Daily registrations last 14 days (project — excludes magazine)
    const [projectDaily] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM registrations
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
        AND competitionCategory != 'Megazine'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Daily registrations last 14 days (wall magazine)
    const [magazineDaily] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM registrations
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
        AND competitionCategory = 'Megazine'
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

    // Competition category breakdown for project (excludes magazine)
    const [categoryBreakdown] = await db.query(`
      SELECT competitionCategory as category, COUNT(*) as count
      FROM registrations
      WHERE competitionCategory != 'Megazine'
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
        magazine: totalMagazine,
        olympiad: totalOlympiad,
        users: totalUsers,
        announcements: totalAnnouncements,
        all: totalProject + totalMagazine + totalOlympiad,
      },
      charts: {
        projectDaily,
        magazineDaily,
        olympiadDaily,
        categoryBreakdown,
        userGrowth,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

/* ── Individual-member count helper expression ───────────────────────
   Counts each non-empty member column as +1 on top of the leader.       */
const MEMBER_SUM = `
  1
  + IF(member2 IS NOT NULL AND member2 != '', 1, 0)
  + IF(member3 IS NOT NULL AND member3 != '', 1, 0)
  + IF(member4 IS NOT NULL AND member4 != '', 1, 0)
  + IF(member5 IS NOT NULL AND member5 != '', 1, 0)
  + IF(member6 IS NOT NULL AND member6 != '', 1, 0)
`;

const getParticipantStats = async (req, res) => {
  try {
    // ── Project: total teams + individuals ──────────────────────────
    const [[projectTotals]] = await db.query(`
      SELECT
        COUNT(*) AS teams,
        SUM(${MEMBER_SUM}) AS individuals
      FROM registrations
      WHERE competitionCategory = 'Project'
    `);

    // ── Project: breakdown by subcategory × education group ─────────
    const [projectBreakdown] = await db.query(`
      SELECT
        projectSubcategory AS subcategory,
        categories          AS education_group,
        COUNT(*)            AS teams,
        SUM(${MEMBER_SUM})  AS individuals
      FROM registrations
      WHERE competitionCategory = 'Project'
      GROUP BY projectSubcategory, categories
      ORDER BY projectSubcategory, categories
    `);

    // ── Project: breakdown by subcategory only (subtotals) ──────────
    const [projectBySubcategory] = await db.query(`
      SELECT
        projectSubcategory AS subcategory,
        COUNT(*)            AS teams,
        SUM(${MEMBER_SUM})  AS individuals
      FROM registrations
      WHERE competitionCategory = 'Project'
      GROUP BY projectSubcategory
      ORDER BY projectSubcategory
    `);

    // ── Project: breakdown by education group only ───────────────────
    const [projectByGroup] = await db.query(`
      SELECT
        categories         AS education_group,
        COUNT(*)           AS teams,
        SUM(${MEMBER_SUM}) AS individuals
      FROM registrations
      WHERE competitionCategory = 'Project'
      GROUP BY categories
      ORDER BY categories
    `);

    // ── Wall Magazine: total teams + individuals ─────────────────────
    const [[wallTotals]] = await db.query(`
      SELECT
        COUNT(*) AS teams,
        SUM(${MEMBER_SUM}) AS individuals
      FROM registrations
      WHERE competitionCategory = 'Megazine'
    `);

    // ── Wall Magazine: breakdown by education group ──────────────────
    const [wallBreakdown] = await db.query(`
      SELECT
        categories         AS education_group,
        COUNT(*)           AS teams,
        SUM(${MEMBER_SUM}) AS individuals
      FROM registrations
      WHERE competitionCategory = 'Megazine'
      GROUP BY categories
      ORDER BY categories
    `);

    // ── Olympiad: total + by education category ──────────────────────
    const [[olympiadTotal]] = await db.query(
      'SELECT COUNT(*) AS individuals FROM olympiad_registrations'
    );
    const [olympiadBreakdown] = await db.query(`
      SELECT category AS education_group, COUNT(*) AS individuals
      FROM olympiad_registrations
      GROUP BY category
      ORDER BY category
    `);

    res.json({
      success: true,
      project: {
        teams:       projectTotals.teams       || 0,
        individuals: projectTotals.individuals || 0,
        bySubcategory: projectBySubcategory,
        byGroup:       projectByGroup,
        breakdown:     projectBreakdown,
      },
      wall_magazine: {
        teams:       wallTotals.teams       || 0,
        individuals: wallTotals.individuals || 0,
        breakdown:   wallBreakdown,
      },
      olympiad: {
        individuals: olympiadTotal.individuals || 0,
        breakdown:   olympiadBreakdown,
      },
    });
  } catch (error) {
    console.error('ParticipantStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch participant stats' });
  }
};

module.exports = { getAnalytics, getParticipantStats };
