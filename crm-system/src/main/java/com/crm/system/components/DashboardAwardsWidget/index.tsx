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
  CircularProgress,
  Button,
  Rating,
  Avatar,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  MilitaryTech as MilitaryTechIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Stars as StarsIcon,
  GppMaybe as GppMaybeIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';

interface Award {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  category: 'performance' | 'attendance' | 'feedback' | 'community' | 'special';
}

const DashboardAwardsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [awards, setAwards] = useState<Award[]>([
    // Demo awards
    {
      id: 1,
      title: 'Первый урок',
      description: 'Завершите свой первый урок',
      icon: <MilitaryTechIcon />,
      earned: true,
      earnedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      rarity: 'common',
      points: 10,
      category: 'performance',
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
      category: 'attendance',
    },
    {
      id: 3,
      title: 'Марафон знаний',
      description: 'Завершите 30 уроков',
      icon: <StarsIcon />,
      earned: false,
      rarity: 'epic',
      points: 100,
      category: 'performance',
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
      category: 'performance',
    },
    {
      id: 5,
      title: 'Ранняя пташка',
      description: 'Посетите урок до 8:00 утра',
      icon: <GppMaybeIcon />,
      earned: false,
      rarity: 'rare',
      points: 75,
      category: 'attendance',
    },
    {
      id: 6,
      title: 'Лидер группы',
      description: 'Станьте самым активным участником группы',
      icon: <AutoAwesomeIcon />,
      earned: false,
      rarity: 'epic',
      points: 150,
      category: 'community',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadAwards();
    }
  }, [user?.id]);

  const loadAwards = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would fetch actual awards
      // For now, we'll use demo data
      
      // Calculate total points
      const earnedPoints = awards
        .filter(award => award.earned)
        .reduce((sum, award) => sum + award.points, 0);
      setTotalPoints(earnedPoints);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки наград');
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: Award['rarity']) => {
    switch (rarity) {
      case 'common': return 'default';
      case 'rare': return 'info';
      case 'epic': return 'secondary';
      case 'legendary': return 'warning';
      default: return 'default';
    }
  };

  const getRarityText = (rarity: Award['rarity']) => {
    switch (rarity) {
      case 'common': return 'Обычная';
      case 'rare': return 'Редкая';
      case 'epic': return 'Эпическая';
      case 'legendary': return 'Легендарная';
      default: return 'Неизвестная';
    }
  };

  const getCategoryIcon = (category: Award['category']) => {
    switch (category) {
      case 'performance': return <TrendingUpIcon fontSize="small" />;
      case 'attendance': return <EventIcon fontSize="small" />;
      case 'feedback': return <RateReviewIcon fontSize="small" />;
      case 'community': return <GroupIcon fontSize="small" />;
      case 'special': return <AutoAwesomeIcon fontSize="small" />;
      default: return <EmojiEventsIcon fontSize="small" />;
    }
  };

  const getCategoryColor = (category: Award['category']) => {
    switch (category) {
      case 'performance': return 'primary';
      case 'attendance': return 'secondary';
      case 'feedback': return 'success';
      case 'community': return 'info';
      case 'special': return 'warning';
      default: return 'default';
    }
  };

  const getCategoryText = (category: Award['category']) => {
    switch (category) {
      case 'performance': return 'Производительность';
      case 'attendance': return 'Посещаемость';
      case 'feedback': return 'Обратная связь';
      case 'community': return 'Сообщество';
      case 'special': return 'Специальные';
      default: return 'Разное';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const earnedAwards = awards.filter(a => a.earned);
  const lockedAwards = awards.filter(a => !a.earned);

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<EmojiEventsIcon color="secondary" />}
        title="Награды и достижения"
        subheader={`Всего очков: ${totalPoints} • Получено: ${earnedAwards.length}/${awards.length}`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : awards.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет наград
          </Typography>
        ) : (
          <>
            {earnedAwards.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Полученные награды:
                </Typography>
                <List disablePadding sx={{ mb: 2 }}>
                  {earnedAwards.map((award, index) => (
                    <React.Fragment key={award.id}>
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
                            {award.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {award.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              >
                                {award.description}
                              </Typography>
                              <br />
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                  icon={getCategoryIcon(award.category)} 
                                  label={getCategoryText(award.category)} 
                                  color={getCategoryColor(award.category) as any}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 1 }}
                                />
                                <Chip 
                                  label={getRarityText(award.rarity)} 
                                  color={getRarityColor(award.rarity) as any}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 1 }}
                                />
                                <Chip 
                                  label={`+${award.points} очков`} 
                                  color="success"
                                  size="small"
                                  variant="outlined"
                                />
                                {award.earnedDate && (
                                  <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                                    Получено: {formatDate(award.earnedDate)}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < earnedAwards.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
            
            {lockedAwards.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Доступные награды:
                </Typography>
                <List disablePadding>
                  {lockedAwards.map((award, index) => (
                    <React.Fragment key={award.id}>
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
                            {award.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {award.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              >
                                {award.description}
                              </Typography>
                              <br />
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                  icon={getCategoryIcon(award.category)} 
                                  label={getCategoryText(award.category)} 
                                  color={getCategoryColor(award.category) as any}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 1 }}
                                />
                                <Chip 
                                  label={getRarityText(award.rarity)} 
                                  color={getRarityColor(award.rarity) as any}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 1 }}
                                />
                                <Chip 
                                  label={`+${award.points} очков`} 
                                  color="default"
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < lockedAwards.length - 1 && <Divider />}
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

export default DashboardAwardsWidget;