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
  LinearProgress,
} from '@mui/material';
import {
  Reviews as ReviewsIcon,
  Star as StarIcon,
  Person as PersonIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';

interface Review {
  id: number;
  author: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  subject?: string;
  teacher?: string;
  verified: boolean;
}

const DashboardReviewsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [reviews, setReviews] = useState<Review[]>([
    // Demo reviews
    {
      id: 1,
      author: 'Анна Петрова',
      authorAvatar: '',
      rating: 5,
      comment: 'Отличный преподаватель! Объясняет доступно, всегда помогает разобраться в сложных темах.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      subject: 'Грамматика',
      teacher: 'Иванов И.И.',
      verified: true,
    },
    {
      id: 2,
      author: 'Михаил Сидоров',
      authorAvatar: '',
      rating: 4,
      comment: 'Хорошие занятия, но иногда сложно успевать за темпом. Возможно, стоит чуть замедлить объяснения.',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      subject: 'Разговорная практика',
      teacher: 'Смирнова Е.А.',
      verified: true,
    },
    {
      id: 3,
      author: 'Екатерина Васильева',
      authorAvatar: '',
      rating: 5,
      comment: 'Прекрасный опыт! Очень благодарна за профессиональный подход и терпение.',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      subject: 'Аудирование',
      teacher: 'Кузнецова М.В.',
      verified: true,
    },
    {
      id: 4,
      author: 'Алексей Козлов',
      authorAvatar: '',
      rating: 4,
      comment: 'Занятия полезные, но хотелось бы больше практических заданий.',
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      subject: 'Письмо',
      teacher: 'Попов А.С.',
      verified: false,
    },
  ]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateAverageRating();
    if (user?.role === 'TEACHER' || user?.role === 'MANAGER' || user?.role === 'ADMIN') {
      loadReviews();
    }
  }, [user?.id, reviews]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) {
      setAverageRating(0);
      setTotalReviews(0);
      return;
    }
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const avg = sum / reviews.length;
    setAverageRating(avg);
    setTotalReviews(reviews.length);
  };

  const loadReviews = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would fetch actual reviews
      // For now, we'll use the demo data
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки отзывов');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // For ratings 1-5
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });
    
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<ReviewsIcon color="secondary" />}
        title="Отзывы студентов"
        subheader={`Средняя оценка: ${averageRating.toFixed(1)} из 5 (${totalReviews} отзывов)`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : reviews.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Пока нет отзывов
          </Typography>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Rating 
                value={averageRating} 
                readOnly 
                size="large" 
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <Typography variant="h6" sx={{ ml: 1 }}>
                {averageRating.toFixed(1)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Chip 
                label={`${totalReviews} отзывов`} 
                color="primary" 
                size="small" 
                variant="outlined"
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Распределение по оценкам:
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ minWidth: 80 }}>
                    <Rating 
                      value={rating} 
                      readOnly 
                      size="small" 
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={totalReviews > 0 ? (ratingDistribution[5 - rating - 1] / totalReviews) * 100 : 0} 
                    color={rating >= 4 ? "success" : rating >= 3 ? "warning" : "error"}
                    sx={{ flex: 1, mx: 1 }}
                  />
                  <Typography variant="caption" sx={{ minWidth: 30, textAlign: 'right' }}>
                    {ratingDistribution[5 - rating - 1]}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Последние отзывы:
            </Typography>
            
            <List disablePadding>
              {reviews.slice(0, 3).map((review, index) => (
                <React.Fragment key={review.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      {review.authorAvatar ? (
                        <Avatar src={review.authorAvatar} sx={{ width: 32, height: 32 }} />
                      ) : (
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {review.author.charAt(0)}
                        </Avatar>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">
                            {review.author}
                          </Typography>
                          <Rating 
                            value={review.rating} 
                            readOnly 
                            size="small" 
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {review.comment}
                          </Typography>
                          <br />
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <DateRangeIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                            <Typography
                              component="span"
                              variant="caption"
                              color="textSecondary"
                            >
                              {formatDate(review.date)}
                            </Typography>
                            {review.subject && (
                              <Typography
                                component="span"
                                variant="caption"
                                color="textSecondary"
                                sx={{ mx: 1 }}
                              >
                                •
                              </Typography>
                            )}
                            {review.subject && (
                              <Chip 
                                label={review.subject} 
                                size="small" 
                                variant="outlined"
                                sx={{ mr: 1 }}
                              />
                            )}
                            {review.teacher && (
                              <Chip 
                                icon={<PersonIcon fontSize="small" />} 
                                label={review.teacher} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                            {review.verified && (
                              <Chip 
                                label="Проверено" 
                                color="success" 
                                size="small" 
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < Math.min(reviews.length, 3) - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<ReviewsIcon />}>
                Все отзывы
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardReviewsWidget;