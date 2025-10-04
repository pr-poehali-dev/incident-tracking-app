import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Incident {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  assignee: string;
  createdAt: string;
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Сбой системы авторизации',
    description: 'Пользователи не могут войти в систему',
    priority: 'critical',
    status: 'in-progress',
    assignee: 'Алексей Иванов',
    createdAt: '2025-10-04T10:30:00'
  },
  {
    id: '2',
    title: 'Медленная загрузка базы данных',
    description: 'Время ответа БД превышает норму',
    priority: 'high',
    status: 'open',
    assignee: 'Мария Петрова',
    createdAt: '2025-10-04T09:15:00'
  },
  {
    id: '3',
    title: 'Ошибка в отчетах',
    description: 'Неверные данные в экспорте',
    priority: 'medium',
    status: 'open',
    assignee: 'Дмитрий Сидоров',
    createdAt: '2025-10-04T08:00:00'
  },
  {
    id: '4',
    title: 'Обновление интерфейса',
    description: 'Незначительные правки в UI',
    priority: 'low',
    status: 'resolved',
    assignee: 'Елена Козлова',
    createdAt: '2025-10-03T16:45:00'
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'incidents' | 'users' | 'reports' | 'settings'>('dashboard');
  const [incidents] = useState<Incident[]>(mockIncidents);

  const stats = {
    total: incidents.length,
    critical: incidents.filter(i => i.priority === 'critical').length,
    open: incidents.filter(i => i.status === 'open').length,
    resolved: incidents.filter(i => i.status === 'resolved').length
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-muted text-muted-foreground';
      case 'in-progress': return 'bg-primary text-primary-foreground';
      case 'resolved': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const showNotification = (incident: Incident) => {
    toast.error(`Критический инцидент: ${incident.title}`, {
      description: incident.description,
      action: {
        label: 'Открыть',
        onClick: () => setActiveTab('incidents')
      }
    });
  };

  const criticalIncidents = incidents.filter(i => i.priority === 'critical');
  if (criticalIncidents.length > 0) {
    setTimeout(() => {
      criticalIncidents.forEach(incident => {
        if (incident.status !== 'resolved') {
          showNotification(incident);
        }
      });
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-sidebar-foreground flex items-center gap-2">
              <Icon name="AlertTriangle" size={28} className="text-primary" />
              Incident Tracker
            </h1>
          </div>
          
          <nav className="px-3 space-y-1">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('dashboard')}
            >
              <Icon name="LayoutDashboard" size={20} className="mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'incidents' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('incidents')}
            >
              <Icon name="AlertCircle" size={20} className="mr-2" />
              Инциденты
              {stats.critical > 0 && (
                <Badge className="ml-auto animate-pulse-notification" variant="destructive">
                  {stats.critical}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('users')}
            >
              <Icon name="Users" size={20} className="mr-2" />
              Пользователи
            </Button>
            <Button
              variant={activeTab === 'reports' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('reports')}
            >
              <Icon name="FileText" size={20} className="mr-2" />
              Отчеты
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Icon name="Settings" size={20} className="mr-2" />
              Настройки
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
                <p className="text-muted-foreground mt-1">Обзор состояния системы</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Всего инцидентов</CardTitle>
                    <Icon name="Layers" size={20} className="text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">За последний месяц</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-destructive/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Критические</CardTitle>
                    <Icon name="AlertTriangle" size={20} className="text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-destructive">{stats.critical}</div>
                    <p className="text-xs text-muted-foreground mt-1">Требуют внимания</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Открытые</CardTitle>
                    <Icon name="Circle" size={20} className="text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.open}</div>
                    <p className="text-xs text-muted-foreground mt-1">В работе</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-success/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Решенные</CardTitle>
                    <Icon name="CheckCircle" size={20} className="text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success">{stats.resolved}</div>
                    <p className="text-xs text-muted-foreground mt-1">Закрыто успешно</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Последние инциденты</CardTitle>
                  <CardDescription>Требуют внимания</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {incidents.slice(0, 3).map((incident, idx) => (
                      <div 
                        key={incident.id}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{incident.title}</h4>
                            <Badge className={getPriorityColor(incident.priority)}>
                              {incident.priority}
                            </Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{incident.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Icon name="User" size={14} />
                            {incident.assignee}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Подробнее
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Инциденты</h2>
                  <p className="text-muted-foreground mt-1">Полный список инцидентов</p>
                </div>
                <Button>
                  <Icon name="Plus" size={20} className="mr-2" />
                  Новый инцидент
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {incidents.map((incident, idx) => (
                  <Card 
                    key={incident.id}
                    className="hover:shadow-lg transition-all hover:scale-[1.01]"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{incident.title}</CardTitle>
                            <Badge className={getPriorityColor(incident.priority)}>
                              {incident.priority}
                            </Badge>
                          </div>
                          <CardDescription>{incident.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Icon name="User" size={16} />
                            {incident.assignee}
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="Calendar" size={16} />
                            {new Date(incident.createdAt).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Icon name="Edit" size={16} className="mr-1" />
                            Изменить
                          </Button>
                          <Button variant="outline" size="sm">
                            <Icon name="MessageSquare" size={16} className="mr-1" />
                            Комментарии
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground">Пользователи</h2>
              <p className="text-muted-foreground mt-1">Управление командой</p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground">Отчеты</h2>
              <p className="text-muted-foreground mt-1">Аналитика и статистика</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground">Настройки</h2>
              <p className="text-muted-foreground mt-1">Конфигурация системы</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
