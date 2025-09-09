import React, { useState } from 'react';
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
  TextField,
  TextareaAutosize,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Help as HelpIcon,
  SupportAgent as SupportAgentIcon,
  LiveHelp as LiveHelpIcon,
  ContactSupport as ContactSupportIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoLibraryIcon,
  Description as DescriptionIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';

interface HelpResource {
  id: number;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'faq' | 'article';
  link?: string;
  duration?: string;
  category: string;
}

interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const DashboardHelpWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [resources, setResources] = useState<HelpResource[]>([
    // Demo help resources
    {
      id: 1,
      title: 'Как запланировать урок',
      description: 'Пошаговое руководство по планированию индивидуальных и групповых уроков',
      type: 'guide',
      link: '#',
      category: 'Расписание',
    },
    {
      id: 2,
      title: 'Видео: Основы работы с CRM',
      description: 'Видеоруководство по основным функциям системы',
      type: 'video',
      duration: '12:45',
      link: '#',
      category: 'Видео',
    },
    {
      id: 3,
      title: 'Часто задаваемые вопросы',
      description: 'Ответы на наиболее часто задаваемые вопросы',
      type: 'faq',
      link: '#',
      category: 'FAQ',
    },
    {
      id: 4,
      title: 'Управление пакетами уроков',
      description: 'Как создавать, редактировать и отслеживать пакеты уроков студентов',
      type: 'article',
      link: '#',
      category: 'Пакеты',
    },
  ]);
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 1,
      subject: 'Проблема с доступом к Telegram-боту',
      description: 'Пользователь не может подключиться к Telegram-боту. Сообщение об ошибке: "Неверный токен".',
      priority: 'medium',
      status: 'in-progress',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });
  const [activeTab, setActiveTab] = useState<'help' | 'support'>('help');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmitTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // In a real implementation, you would submit the ticket to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new ticket to the list
      const ticket: SupportTicket = {
        id: Date.now(),
        subject: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setTickets([ticket, ...tickets]);
      setNewTicket({
        subject: '',
        description: '',
        priority: 'medium',
      });
      
      setSuccess('Запрос в службу поддержки успешно отправлен');
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки запроса в службу поддержки');
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type: HelpResource['type']) => {
    switch (type) {
      case 'guide':
        return <DescriptionIcon fontSize="small" />;
      case 'video':
        return <VideoLibraryIcon fontSize="small" />;
      case 'faq':
        return <ContactSupportIcon fontSize="small" />;
      case 'article':
        return <ArticleIcon fontSize="small" />;
      default:
        return <HelpIcon fontSize="small" />;
    }
  };

  const getResourceColor = (type: HelpResource['type']) => {
    switch (type) {
      case 'guide':
        return 'primary';
      case 'video':
        return 'secondary';
      case 'faq':
        return 'info';
      case 'article':
        return 'success';
      default:
        return 'default';
    }
  };

  const getResourceText = (type: HelpResource['type']) => {
    switch (type) {
      case 'guide':
        return 'Руководство';
      case 'video':
        return 'Видео';
      case 'faq':
        return 'FAQ';
      case 'article':
        return 'Статья';
      default:
        return 'Ресурс';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityText = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low':
        return 'Низкий';
      case 'medium':
        return 'Средний';
      case 'high':
        return 'Высокий';
      case 'urgent':
        return 'Срочный';
      default:
        return 'Не указан';
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'info';
      case 'in-progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'Открыт';
      case 'in-progress':
        return 'В работе';
      case 'resolved':
        return 'Решен';
      case 'closed':
        return 'Закрыт';
      default:
        return 'Неизвестно';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<HelpIcon color="secondary" />}
        title="Помощь и поддержка"
        subheader="Документация, видеоруководства и техническая поддержка"
      />
      
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Chip 
            label="Справочный центр" 
            icon={<LiveHelpIcon />} 
            color="primary" 
            size="small" 
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip 
            label="Техподдержка" 
            icon={<SupportAgentIcon />} 
            color="secondary" 
            size="small" 
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button 
            variant={activeTab === 'help' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('help')}
            startIcon={<HelpIcon />}
            sx={{ mr: 1 }}
          >
            Справочные материалы
          </Button>
          <Button 
            variant={activeTab === 'support' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('support')}
            startIcon={<SupportAgentIcon />}
          >
            Техподдержка
          </Button>
        </Box>
        
        {activeTab === 'help' ? (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Полезные ресурсы:
            </Typography>
            
            <List disablePadding>
              {resources.map((resource, index) => (
                <React.Fragment key={resource.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ py: 1, px: 0, cursor: 'pointer' }}
                    onClick={() => {
                      // Navigate to resource
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <Chip 
                        icon={getResourceIcon(resource.type)} 
                        label={getResourceText(resource.type)} 
                        color={getResourceColor(resource.type) as any}
                        size="small"
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" noWrap>
                          {resource.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {resource.description}
                          </Typography>
                          <br />
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Chip 
                              label={resource.category} 
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            {resource.duration && (
                              <Chip 
                                icon={<VideoLibraryIcon fontSize="small" />} 
                                label={resource.duration} 
                                size="small"
                                variant="outlined"
                                color="secondary"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < resources.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<ArticleIcon />}>
                Все справочные материалы
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Отправить запрос в техподдержку:
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Тема запроса"
                variant="outlined"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                margin="normal"
                required
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Приоритет</InputLabel>
                <Select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                  label="Приоритет"
                >
                  <MenuItem value="low">Низкий</MenuItem>
                  <MenuItem value="medium">Средний</MenuItem>
                  <MenuItem value="high">Высокий</MenuItem>
                  <MenuItem value="urgent">Срочный</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Описание проблемы"
                variant="outlined"
                multiline
                rows={4}
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                margin="normal"
                required
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<MailIcon />}
                  onClick={handleSubmitTicket}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Отправить запрос'}
                </Button>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Мои запросы в техподдержку:
            </Typography>
            
            {tickets.length === 0 ? (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
                У вас нет открытых запросов
              </Typography>
            ) : (
              <List disablePadding>
                {tickets.map((ticket, index) => (
                  <React.Fragment key={ticket.id}>
                    <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                        <Chip 
                          label={getPriorityText(ticket.priority)} 
                          color={getPriorityColor(ticket.priority) as any}
                          size="small"
                          variant="outlined"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" noWrap>
                              {ticket.subject}
                            </Typography>
                            <Chip 
                              label={getStatusText(ticket.status)} 
                              color={getStatusColor(ticket.status) as any}
                              size="small"
                              variant="outlined"
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
                              {ticket.description}
                            </Typography>
                            <br />
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
                                Создан: {formatDate(ticket.createdAt)}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                Обновлен: {formatDate(ticket.updatedAt)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < tickets.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<ChatIcon />}
            sx={{ mr: 1 }}
          >
            Онлайн-чат
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<PhoneIcon />}
            sx={{ mr: 1 }}
          >
            Позвонить
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<MailIcon />}
          >
            Написать email
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardHelpWidget;