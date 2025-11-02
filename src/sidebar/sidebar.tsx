import React from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Badge, Box } from '@mui/material';
import { ModeEdit, TaskAlt, ChecklistRtl, 
  Reorder, Groups, Folder, 
  LanOutlined, Storage, SettingsSuggest, 
  Home, InfoOutlined, PersonOutlined, 
  ViewListOutlined, EngineeringOutlined, 
  SupportAgentOutlined
} from '@mui/icons-material'
import '../styles/sidebar.scss';

const activeColor = '#455980ff';
const backgroundColor = '#32415c';
const color = '#909fbbff';

export function LeftSidebar() {
  const location = useLocation();
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
            icon={<Home />}
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
              component={<Link to={'/requests/in-work'} />} // Поменять
              active={location.pathname.includes('/requests/in-work')}  // Поменять
              suffix={<Badge badgeContent={433} color="primary"></Badge>}
            >Новые заявки</MenuItem>
            <MenuItem
              component={<Link to={'/support/all'}/>}
              active={location.pathname.includes('/support/all')}
              suffix={<Badge badgeContent={433} color="primary"></Badge>}
            >Заявки (все)</MenuItem>
            <MenuItem
              component={<Link to={'/requests/on-confirm'} />}  // Поменять
              active={location.pathname.includes('/requests/on-confirm')} // Поменять
              suffix={<Badge badgeContent={999} color="warning"></Badge>}
            >Заявки (не согласованные)</MenuItem>
            <MenuItem
              component={<Link to={'/requests/success'} />}   // Поменять
              active={location.pathname.includes('/requests/success')}  // Поменять
              suffix={<Badge badgeContent={999} color="warning"></Badge>}
            >Заявки (не подтвержденные)</MenuItem>
            <MenuItem
              component={<Link to={'/requests/success'} />}   // Поменять
              active={location.pathname.includes('/requests/success')}  // Поменять
              suffix={<Badge badgeContent={433} color="primary"></Badge>}
            >Заявки (на контроле)</MenuItem>
            <MenuItem
              component={<Link to={'/requests/success'} />}   // Поменять
              active={location.pathname.includes('/requests/success')}  // Поменять
            >Мои заявки</MenuItem>
            
          </SubMenu>
          <SubMenu label="Задачи"
          defaultOpen={true}
          style={{height: '35px',
            marginLeft: '-20px',
            width: '330px'
          }}
          icon = {<ViewListOutlined/>}>
            <MenuItem
            suffix={<Badge badgeContent={999} color="warning"></Badge>}
            >Групповые (не принятые)</MenuItem>
            <MenuItem
            suffix={<Badge badgeContent={999} color="warning"></Badge>}
            >Задачи на исполнение</MenuItem>
            <MenuItem
            suffix={<Badge badgeContent={999} color="warning"></Badge>}
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
