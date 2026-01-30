import React, { useMemo } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Box, Typography } from '@mui/material';
import {
  ModeEdit, TaskAlt, ChecklistRtl,
  Reorder, Groups, Folder,
  LanOutlined, Storage, SettingsSuggest,
  HomeOutlined, InfoOutlined, PersonOutlined,
  ViewListOutlined, EngineeringOutlined,
  SupportAgentOutlined
} from '@mui/icons-material'
import '../styles/sidebar.scss';
import { data, type Request } from '../pages/support/all-support/makeData';
import { stat } from "fs";
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, ListSubheader, Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import { alignProperty } from "@mui/material/styles/cssUtils";

import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../api/services/orderService';

const activeColor = '#455980ff';
const submenuColor = '#32415c';
const submenuColor1 = '#2c3951';
const backgroundColor = '#3b4c6c';
const color = '#909fbbff';
const sectionTitleColor = "#c0d0f0";
const currentUser = {
  name: "Борисов Борис Борисович",
  role: "Старший специалист",
  avatarUrl: null, // или "https://..." если есть фото
  initials: "ВА"   // или генерировать автоматически
};



function useRequestCounts() {

  const {
      data: orders = [],
      isLoading,
      error,
  } = useQuery({
      queryKey: ['orders'],
      queryFn: getOrders,
  });

  return useMemo(() => {

    const newCount = orders.filter((item: any) => item.orderStatus?.name === 'Новая').length;
    const allCount = orders.filter((item: any) => item.orderStatus?.name !== 'Закрыта').length;
    const nAgreedCount = orders.filter((item: any) => item.orderStatus?.name === 'Не согласовано').length;
    const nConfirmedCount = orders.filter((item: any) => item.orderStatus?.name === 'Возобновлена').length;
    const onControlCount = orders.filter((item: any) => item.orderStatus?.name === 'На контроле').length;
    const exeCount = orders.filter((item: any) => item.orderStatus?.name !== 'Закрыта' && item.dispatcher?.name === currentUser.name).length;
    return {
      newCount,
      allCount,
      nAgreedCount,
      nConfirmedCount,
      onControlCount,
      exeCount
    };
  }, [orders]);
}

export function LeftSidebar() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = params.get('status');
  
  const isSupportAll = location.pathname === '/support/all';
  const isTasksAll = location.pathname === '/tasks/my-all-tasks'
  const isNewActive = isSupportAll && status === 'Новая';
  const isAllActive = isSupportAll && !status;
  const isNAgreedActive = isSupportAll && status === 'nAgreed';
  const isNConfirmedActive = isSupportAll && status === 'nConfirmed';
  const isOnControlActive = isSupportAll && status === 'onControl';
  const isOnExecution = isTasksAll && status === 'onExecution';
  const isOnAgree = isTasksAll && status === 'onAgree';
  const isMeActive = isTasksAll && status === 'mine';

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
    style: {
      marginLeft: '0px',
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
      sx={{
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
            style={{
              marginLeft: '0px',
              width: '100%',
              background: submenuColor1,
              color: 'white',
              justifyContent: 'center',
              padding: '20px 0px 20px 0px',
            }}
            rootStyles={{
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
            icon={<SupportAgentOutlined />}
            component={<Link to={'/support/all?status=Новая'} />}
            active={isNewActive}
            suffix={<Badge badgeContent={newCount} color="primary"></Badge>}
          >
            Новые заявки
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<SupportAgentOutlined />}
            component={<Link to={'/support/all'} />}
            active={isAllActive}
            suffix={<Badge badgeContent={allCount} color="warning"></Badge>}
          >
            Заявки (все)
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<SupportAgentOutlined />}
            component={<Link to={'/support/all?status=nAgreed'} />}
            active={isNAgreedActive}
            suffix={<Badge badgeContent={nAgreedCount} color="primary"></Badge>}
          >
            Заявки (не согласованные)
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<SupportAgentOutlined />}
            component={<Link to={'/support/all?status=nConfirmed'} />}
            active={isNConfirmedActive}
            suffix={<Badge badgeContent={nConfirmedCount} color="warning"></Badge>}
          >
            Заявки (не подтвержденные)
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<SupportAgentOutlined />}
            component={<Link to={'/support/all?status=onControl'} />}
            active={isOnControlActive}
            suffix={<Badge badgeContent={onControlCount} color="primary"></Badge>}
          >
            Заявки (на контроле)
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<SupportAgentOutlined />}
            component={<Link to={'/support/all?status=mine'} />}
            active={isMeActive}
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
            icon={<ViewListOutlined />}
          >
            Групповые (не принятые)
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<ViewListOutlined />}
            component={<Link to={'/tasks/all?status=onExecution'} />}
            active={isOnExecution}
            suffix={<Badge badgeContent={exeCount} color="warning"></Badge>}
          >
            Задачи на исполнение
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<ViewListOutlined />}
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
            icon={<LanOutlined />}
            component={<Link to={'/services_catalog/tree'} />}
            active={location.pathname.includes('/services_catalog/tree')}
          >
            Дерево ИТ-услуг
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<LanOutlined />}
            component={<Link to={'/services_catalog/itcatalog'} />}
            active={location.pathname.includes('/services_catalog/itcatalog')}
          >
            ИТ-услуги
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<LanOutlined />}
            component={<Link to={'/services_catalog/itservices'} />}
            active={location.pathname.includes('/services_catalog/itservices')}
          >
            ИТ-сервисы
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<LanOutlined />}
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
            icon={<EngineeringOutlined />}
            component={<Link to={'/admin/manual'}/>}
            active={location.pathname.includes('/admin/manual')}
          >
            Справочники
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<EngineeringOutlined />}
            component={<Link to={'/admin/schedule'}/>}
            active={location.pathname.includes('/admin/schedule')}
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
            icon={<PersonOutlined />}
            component={<Link to={'/info/profile'}/>}
            active={location.pathname.includes('/info/profile')}
          >
            Мой профиль
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<InfoOutlined />}
            component={<Link to={'/info/webservices'}/>}
            active={location.pathname.includes('/info/webservices')}
          >
            Веб-сервисы
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<InfoOutlined />}
            component={<Link to={'/info/itcatalog'}/>}
            active={location.pathname.includes('/info/itcatalog')}
          >
            Каталог ИТ-услуг
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<InfoOutlined />}
            component={<Link to={'/info/knowbase'}/>}
            active={location.pathname.includes('/info/knowbase')}
          >
            База знаний
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<InfoOutlined />}
            suffix={<Badge badgeContent={999} color="warning"></Badge>}
            component={<Link to={'/info/notifications'}/>}
            active={location.pathname.includes('/info/notifications')}
          >
            Уведомления
          </MenuItem>

          <MenuItem
            {...menuItemCommon}
            icon={<InfoOutlined />}
            component={<Link to={'/info/reference'}/>}
            active={location.pathname.includes('/info/reference')}
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
    </Box>
  );

}
