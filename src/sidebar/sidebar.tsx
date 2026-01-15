import React, {useMemo} from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Box, Typography } from '@mui/material';
import { ModeEdit, TaskAlt, ChecklistRtl, 
  Reorder, Groups, Folder, 
  LanOutlined, Storage, SettingsSuggest, 
  HomeOutlined, InfoOutlined, PersonOutlined, 
  ViewListOutlined, EngineeringOutlined, 
  SupportAgentOutlined
} from '@mui/icons-material'
import '../styles/sidebar.scss';
import { data, type Request } from '../pages/support/all-support/makeData';
import { stat } from "fs";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, 
         ListItemText, ListSubheader, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import { alignProperty } from "@mui/material/styles/cssUtils";

const activeColor = '#455980ff';
const submenuColor = '#32415c';
const submenuColor1 = '#2c3951';
const backgroundColor = '#3b4c6c';
const color = '#909fbbff';
const sectionTitleColor = "#c0d0f0";
const currentUser = {
      name: "Христорождественская В.А.",
      role: "Старший специалист",
      avatarUrl: null, // или "https://..." если есть фото
      initials: "ВА"   // или генерировать автоматически
    };

function useRequestCounts() {
  return useMemo(() => {
    
    const newCount = data.filter(item => item.status === 'Новая').length;
    const allCount = data.filter(item => item.status !== 'Закрыта').length;
    const nAgreedCount = data.filter(item => item.status === 'Не согласовано').length;
    const nConfirmedCount = data.filter(item => item.status === 'Возобновлена').length;
    const onControlCount = data.filter(item => item.status === 'На контроле').length;
    const exeCount = data.filter(item => item.user === currentUser.name && item.status !== 'Закрыта').length;
    return {
      newCount,
      allCount,
      nAgreedCount,
      nConfirmedCount,
      onControlCount,
      exeCount
    };
  }, [data]);
}

export function LeftSidebar() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = params.get('status');

  const isSupportAll = location.pathname === '/support/all';
  const isTasksAll = location.pathname === '/tasks/my-all-tasks'
  const isNewActive  = isSupportAll && status === 'Новая';
  const isAllActive  = isSupportAll && !status;
  const isNAgreedActive = isSupportAll && status === 'nAgreed';
  const isNConfirmedActive = isSupportAll && status === 'nConfirmed';
  const isOnControlActive = isSupportAll && status === 'onControl';
  const isOnExecution = isTasksAll && status === 'onExecution';
  const isOnAgree = isTasksAll && status === 'onAgree';

  const { newCount, allCount, nAgreedCount, nConfirmedCount, onControlCount,
    exeCount
  } = useRequestCounts();
  
  const menuItemCommon = {
    style: { marginLeft: '-10px', width: '310px' },
    rootStyles: { 
      fontWeight: 400,
      fontSize: '1.0rem',
     }
  };

  const sectionHeader = {
    disabled: true,
    style: { marginLeft: '0px', 
      width: '100%', 
      background: submenuColor,
      justifyContent: 'center',
    },
    rootStyles: {
      fontWeight: 600,
      fontSize: '1.0rem',
      opacity: 1,
      cursor: "default",
      "&:hover": { background: "none" },
      textAlign: 'center' as const,
    }
  };
  
  return (
    <Box className={'box'}
      sx = {{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Sidebar 
        width='100%'
        backgroundColor='backgroundColor'
      >
        <Menu
          menuItemStyles={{
            button: ({ active }) => {
              return {
              height: '25px',
              minHeight: '25px',
              padding: '0 10px',
              
              gap: '0px',
              borderRadius: '5px',
              margin: '1px 6px',
              
              backgroundColor: active ? activeColor : backgroundColor,
              color: active ? 'white' : color,
              '&:hover': {
                backgroundColor: activeColor,
                color: 'white',
              },
              }
            },
            
            icon: {
              minWidth: '32px',
              fontSize: '1.1rem',
            },
            suffix: {
              marginLeft: 'auto',
              opacity: 0.85,
            }
          }}
        >
          <MenuItem
            disabled
            style = {{ marginLeft: '0px', 
              width: '100%', 
              background: submenuColor1,
              color: 'white',
              justifyContent: 'center',
              padding: '20px 0px 20px 0px',
            }}
            rootStyles = {{
              color: 'sectionTitleColor',
              fontWeight: 600,
              fontSize: '1.3rem',
              opacity: 1,
              cursor: "default",
              "&:hover": { background: "none" },
              textAlign: 'center' as const,
            }}
          >
            SERVICE-DESK
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            component={<Link to={'/home/home.page'} />}
            active={location.pathname.includes('/home/home.page')}
            icon={<HomeOutlined />}
            >
            Главная страница
          </MenuItem>

          <MenuItem
            {...sectionHeader}
            disabled
          >
            Личные заявки
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<PersonOutlined />}
            component={<Link to={'/requests/all'} />}
            active={location.pathname.includes('/requests/all')}
          >
            Мои заявки
          </MenuItem>
          
          <MenuItem
            {...sectionHeader}
            disabled
          >
            Поддержка
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<SupportAgentOutlined/>}
            component={<Link to={'/support/all?status=Новая'} />}
            active={isNewActive}
            suffix={<Badge badgeContent={newCount} color="primary"></Badge>}
          >
            Новые заявки
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<SupportAgentOutlined/>}
            component={<Link to={'/support/all'}/>}
            active={isAllActive}
            suffix={<Badge badgeContent={allCount} color="warning"></Badge>}
          >
            Заявки (все)
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<SupportAgentOutlined/>}
            component={<Link to={'/support/all?status=nAgreed'}/>}
            active={isNAgreedActive}
            suffix={<Badge badgeContent={nAgreedCount} color="primary"></Badge>}
          >
            Заявки (не согласованные)
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<SupportAgentOutlined/>}
            component={<Link to={'/support/all?status=nConfirmed'}/>}
            active={isNConfirmedActive}
            suffix={<Badge badgeContent={nConfirmedCount} color="warning"></Badge>}
          >
            Заявки (не подтвержденные)
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<SupportAgentOutlined/>}
            component={<Link to={'/support/all?status=onControl'}/>}
            active={isOnControlActive}
            suffix={<Badge badgeContent={onControlCount} color="primary"></Badge>}
          >
            Заявки (на контроле)
          </MenuItem>
          
          <MenuItem
            {...menuItemCommon}
            icon = {<SupportAgentOutlined/>}
            component={<Link to={'/support/all'}/>}
            active={isAllActive}
          >
            Мои заявки
          </MenuItem>
        
          <MenuItem
            {...sectionHeader}
            disabled
          >
            Задачи
          </MenuItem>
          
          <MenuItem
            {...menuItemCommon}
            icon = {<ViewListOutlined/>}
          > 
            Групповые (не принятые)
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<ViewListOutlined/>}
            component={<Link to={'/tasks/all?status=onExecution'} />}
            active={isOnExecution}
            suffix={<Badge badgeContent={exeCount} color="warning"></Badge>}  
          >
            Задачи на исполнение
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<ViewListOutlined/>}
            component={<Link to={'/tasks/all?status=onAgree'} />}
            active={isOnAgree}
          >
            Задачи на согласование
          </MenuItem>
      
          <MenuItem
            {...sectionHeader}
            disabled
          >
            Настройки каталога ИТ-услуг
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<LanOutlined/>}
            component={<Link to={'/services_catalog/tree'} />}
            active={location.pathname.includes('/services_catalog/tree')}
          >
            Дерево ИТ-услуг
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<LanOutlined/>}
            component={<Link to={'/services_catalog/itcatalog'} />}
            active={location.pathname.includes('/services_catalog/itcatalog')}
          >
            ИТ-услуги
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<LanOutlined/>}
            component={<Link to={'/services_catalog/itservices'} />}
            active={location.pathname.includes('/services_catalog/itservices')}
          >
            ИТ-сервисы
          </MenuItem>
          
          <MenuItem
            {...menuItemCommon}
            icon = {<LanOutlined/>}
            component={<Link to={'/services_catalog/history'} />}
            active={location.pathname.includes('/services_catalog/history')}
          >
            История каталога
          </MenuItem>
        
          <MenuItem
            {...sectionHeader}
            disabled
          >
            Администрирование
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<EngineeringOutlined/>}
          >
            Справочники
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<EngineeringOutlined/>}
          >
            График работы УИТ
          </MenuItem>
      
          <MenuItem
            {...sectionHeader}
            disabled
          >
            Информация
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<InfoOutlined/>}
          >
            Веб-сервисы
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<InfoOutlined/>}
          >
            Каталог ИТ-услуг
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<InfoOutlined/>}
          >
            База знаний
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<InfoOutlined/>}
            suffix={<Badge badgeContent={999} color="warning"></Badge>}
          >
            Уведомления
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon = {<InfoOutlined/>}
          >
            Справка о системе
          </MenuItem>
          {/*Чтобы не мешала панель*/}
          <MenuItem
            {...sectionHeader}
            disabled
          ></MenuItem>
        </Menu>
      </Sidebar>

      {/*МБ потом убрать*/}
      <Box
        sx={{
          mt: "auto",
          paddingBottom: '20px',
          borderTop: "1px solid #1e2a44",
          bgcolor: "rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1.5,
          flexShrink: 0,
          flexWrap: "nowrap",
          minHeight: "64px",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#e0e7ff",
                fontWeight: 500,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentUser.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#a0b0d0",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentUser.role}
            </Typography>
          </Box>
      </Box>
        
    </Box>
);

}
