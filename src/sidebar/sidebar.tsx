import React, {useMemo} from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Box } from '@mui/material';
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

const activeColor = '#455980ff';
const backgroundColor = '#32415c';
const color = '#909fbbff';

function useRequestCounts() {
  return useMemo(() => {
    const currUser = 'Христорождественская В.А.';
    const newCount = data.filter(item => item.status === 'Новая').length;
    const allCount = data.filter(item => item.status !== 'Закрыта').length;
    const nAgreedCount = data.filter(item => item.status === 'Не согласовано').length;
    const nConfirmedCount = data.filter(item => item.status === 'Возобновлена').length;
    const onControlCount = data.filter(item => item.status === 'На контроле').length;
    const exeCount = data.filter(item => item.user === currUser && item.status !== 'Закрыта').length;
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

  return (
    <Box className={'box'}>
      <Sidebar style={{width: '100%' }}>
        <Menu
          menuItemStyles={{
            button: ({ active }) => {
              return {
                backgroundColor: active ? activeColor : backgroundColor,
                color: active ? 'white' : color,
                height: '30px',
                width: '310px',
                '&:hover': {
                  backgroundColor: activeColor,
                  color: 'white',
                },
              }
            },
          }}
        >
          <MenuItem
            component={<Link to={'/home/home.page'} />}
            active={location.pathname.includes('/home/home.page')}
            icon={<HomeOutlined />}
            style={{height: '35px',
            marginLeft: '-20px',
            width: '330px'
          }}
          >Главная страница</MenuItem>

          <SubMenu label="Личные заявки" 
          defaultOpen={true}
          style={{height: '35px',
            marginLeft: '-20px',
            width: '330px'
          }}
          icon = {<PersonOutlined/>}>
            <MenuItem
              component={<Link to={'/requests/all'} />}
              active={location.pathname.includes('/requests/all')}
            >Мои заявки</MenuItem>
          </SubMenu>
          
          <SubMenu label="Поддержка" 
          defaultOpen={true}
          style={{height: '35px',
            marginLeft: '-20px',
            width: '330px'
          }}
          icon = {<SupportAgentOutlined/>}>
            <MenuItem
              component={<Link to={'/support/all?status=Новая'} />}
              active={isNewActive}
              suffix={<Badge badgeContent={newCount} color="primary"></Badge>}
            >Новые заявки</MenuItem>
            <MenuItem
              component={<Link to={'/support/all'}/>}
              active={isAllActive}
              suffix={<Badge badgeContent={allCount} color="warning"></Badge>}
            >Заявки (все)</MenuItem>
            <MenuItem
              component={<Link to={'/support/all?status=nAgreed'}/>}
              active={isNAgreedActive}
              suffix={<Badge badgeContent={nAgreedCount} color="primary"></Badge>}
            >Заявки (не согласованные)</MenuItem>
            <MenuItem
              component={<Link to={'/support/all?status=nConfirmed'}/>}
              active={isNConfirmedActive}
              suffix={<Badge badgeContent={nConfirmedCount} color="warning"></Badge>}
            >Заявки (не подтвержденные)</MenuItem>
            <MenuItem
              component={<Link to={'/support/all?status=onControl'}/>}
              active={isOnControlActive}
              suffix={<Badge badgeContent={onControlCount} color="primary"></Badge>}
            >Заявки (на контроле)</MenuItem>
            <MenuItem
              component={<Link to={'/support/all'}/>}
              active={isAllActive}
            >Мои заявки</MenuItem>
          </SubMenu>

          <SubMenu label="Задачи"
          defaultOpen={true}
          style={{height: '35px',
            marginLeft: '-20px',
            width: '330px'
          }}
          icon = {<ViewListOutlined/>}>
            <MenuItem>Групповые (не принятые)</MenuItem>
            <MenuItem
            component={<Link to={'/tasks/all?status=onExecution'} />}
            active={isOnExecution}
            suffix={<Badge badgeContent={exeCount} color="warning"></Badge>}
            >Задачи на исполнение</MenuItem>
            <MenuItem
            component={<Link to={'/tasks/all?status=onAgree'} />}
            active={isOnAgree}
            >Задачи на согласование</MenuItem>
          </SubMenu>

          <SubMenu label="Настройки каталога ИТ-услуг" 
          defaultOpen={true}
          style={{height: '35px',
            marginLeft: '-20px',
            width: '330px'
          }}
          icon = {<LanOutlined/>}>
            <MenuItem
              component={<Link to={'/services_catalog/tree'} />}
              active={location.pathname.includes('/services_catalog/tree')}
            >Дерево ИТ-услуг</MenuItem>
            <MenuItem
              component={<Link to={'/services_catalog/itcatalog'} />}
              active={location.pathname.includes('/services_catalog/itcatalog')}
            >ИТ-услуги</MenuItem>
            <MenuItem
              component={<Link to={'/services_catalog/itservices'} />}
              active={location.pathname.includes('/services_catalog/itservices')}
            >ИТ-сервисы</MenuItem>
            <MenuItem
              component={<Link to={'/services_catalog/history'} />}
              active={location.pathname.includes('/services_catalog/history')}
            >История каталога</MenuItem>
          </SubMenu>

          <SubMenu label="Администрирование"
          defaultOpen={true}
          style={{height: '35px',
            marginLeft: '-20px',
            width: '330px'
          }}
          icon = {<EngineeringOutlined/>}>
            <MenuItem>Справочники</MenuItem>
            <MenuItem>График работы УИТ</MenuItem>
          </SubMenu>
          
          <SubMenu label="Информация"
          defaultOpen={true}
          style={{height: '35px',
            marginLeft: '-20px',
            width: '330px'
          }}
          icon = {<InfoOutlined/>}>
            <MenuItem>Веб-сервисы</MenuItem>
            <MenuItem>Каталог ИТ-услуг</MenuItem>
            <MenuItem>База знаний</MenuItem>
            <MenuItem
            suffix={<Badge badgeContent={999} color="warning"></Badge>}
            >Уведомления</MenuItem>
            <MenuItem>Справка о системе</MenuItem>
          </SubMenu>
          {/*Чтобы не мешала панель*/}
          <MenuItem
          style={{backgroundColor: backgroundColor}}></MenuItem>
        </Menu>
      </Sidebar>
    </Box>
);
}
