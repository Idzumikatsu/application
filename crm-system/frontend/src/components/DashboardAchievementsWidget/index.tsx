import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Button,
  Avatar,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  MilitaryTech as MilitaryTechIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Stars as StarsIcon,
  GppMaybe as GppMaybeIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

const DashboardAchievementsWidget: React.FC = () => {
  const [achievements] = useState<Achievement[]>([
    // Demo achievements
    {
      id: 1,
      title: 'Первый урок',
      description: 'Завершите свой первый урок',
      icon: <MilitaryTechIcon />,
      earned: true,
      earnedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      rarity: 'common',
      points: 10,
    },
    {
      id: 2,
      title: 'Недельная серия',
      description: 'Посетите уроки 7 дней подряд',
      icon: <WorkspacePremiumIcon />,
      earned: true,
      earnedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      rarity: 'rare',
      points: 50,
    },
    {
      id: 3,
      title: 'Марафон знаний',
      description: 'Завершите 30 уроков',
      icon: <StarsIcon />,
      earned: false,
      rarity: 'epic',
      points: 100,
    },
    {
      id: 4,
      title: 'Мастер грамматики',
      description: 'Получите 5 звезд в тесте по грамматике',
      icon: <EmojiEventsIcon />,
      earned: true,
      earnedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      rarity: 'legendary',
      points: 200,
    },
    {
      id: 5,
      title: 'Ранняя пташка',
      description: 'Посетите урок до 8:00 утра',
      icon: <GppMaybeIcon />,
      earned: false,
      rarity: 'rare',
      points: 75,
    },
    {
      id: 6,
      title: 'Лидер группы',
      description: 'Станьте самым активным участником группы',
      icon: <AutoAwesomeIcon />,
      earned: false,
      rarity: 'epic',
      points: 150,
    },
  ]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const earnedPoints = achievements
      .filter(achievement => achievement.earned)
      .reduce((sum, achievement) => sum + achievement.points, 0);
    setTotalPoints(earnedPoints);
  }, [achievements]);


  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'default';
      case 'rare': return 'info';
      case 'epic': return 'secondary';
      case 'legendary': return 'warning';
      default: return 'default';
    }
  };

  const getRarityText = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'Обычное';
      case 'rare': return 'Редкое';
      case 'epic': return 'Эпическое';
      case 'legendary': return 'Легендарное';
      default: return 'Неизвестное';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<EmojiEventsIcon color="secondary" />}
        title="Достижения"
        subheader={`Всего очков: ${totalPoints} • Получено: ${earnedAchievements.length}/${achievements.length}`}
      />
      
      <CardContent>
        {achievements.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет достижений
          </Typography>
        ) : (
          <>
            {earnedAchievements.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Полученные достижения:
                </Typography>
                <List disablePadding sx={{ mb: 2 }}>
                  {earnedAchievements.map((achievement, index) => (
                    <React.Fragment key={achievement.id}>
                      <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: 'secondary.main',
                              color: 'white',
                            }}
                          >
                            {achievement.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {achievement.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              >
                                {achievement.description}
                              </Typography>
                              <br />
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                  label={getRarityText(achievement.rarity)} 
                                  color={getRarityColor(achievement.rarity) as any}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 1 }}
                                />
                                <Chip 
                                  label={`+${achievement.points} очков`} 
                                  color="success"
                                  size="small"
                                  variant="outlined"
                                />
                                {achievement.earnedDate && (
                                  <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                                    Получено: {formatDate(achievement.earnedDate)}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < earnedAchievements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
            
            {lockedAchievements.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Доступные достижения:
                </Typography>
                <List disablePadding>
                  {lockedAchievements.map((achievement, index) => (
                    <React.Fragment key={achievement.id}>
                      <ListItem sx={{ py: 1, px: 0, opacity: 0.7 }}>
                        <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: 'grey.300',
                              color: 'grey.500',
                            }}
                          >
                            {achievement.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {achievement.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              >
                                {achievement.description}
                              </Typography>
                              <br />
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                  label={getRarityText(achievement.rarity)} 
                                  color={getRarityColor(achievement.rarity) as any}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 1 }}
                                />
                                <Chip 
                                  label={`+${achievement.points} очков`} 
                                  color="default"
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < lockedAchievements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<EmojiEventsIcon />}>
                Все достижения
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardAchievementsWidget;