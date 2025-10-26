import React from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Badge, Box } from '@mui/material';
import { ModeEdit, TaskAlt, ChecklistRtl, Reorder, Groups, Folder, Lan, Storage, SettingsSuggest } from '@mui/icons-material'
import '../styles/sidebar.scss';

const activeColor = '#2c3a52';
const backgroundColor = '#32415c';
const color = '#8190ab';

export function LeftSidebar() {
  const location = useLocation();
  return (
    <Box className={'box'}>
      <Sidebar style={{ width: '100%' }}>
        <Menu
          menuItemStyles={{
            button: ({ active }) => {
              return {
                backgroundColor: active ? activeColor : backgroundColor,
                color: active ? 'white' : color,
                height: '35px',
                width: '280px',
                '&:hover': {
                  backgroundColor: activeColor,
                  color: 'white',
                },
              }
            },
          }}
        >
          <SubMenu label="Мои заявки" defaultOpen={true}>
            <MenuItem
              component={<Link to={'/requests/in-work'} />}
              active={location.pathname.includes('/requests/in-work')}
              icon={<ModeEdit />}
              suffix={<Badge badgeContent={433} color="primary"></Badge>}
            >В работе</MenuItem>
            <MenuItem
              component={<Link to={'/requests/on-confirm'} />}
              active={location.pathname.includes('/requests/on-confirm')}
              icon={<ChecklistRtl />}
              suffix={<Badge badgeContent={2} color="warning"></Badge>}
            >На подтверждении</MenuItem>
            <MenuItem
              component={<Link to={'/requests/success'} />}
              active={location.pathname.includes('/requests/success')}
              icon={<TaskAlt />}
            >Выполненные</MenuItem>
            <MenuItem
              component={<Link to={'/requests/all'} />}
              active={location.pathname.includes('/requests/all')}
              icon={<Reorder />}
            >Все</MenuItem>
          </SubMenu>
          <SubMenu label="Поддержка" defaultOpen={true}>
            <MenuItem
              component={<Link to={'/support/all'}/>}
              active={location.pathname.includes('/support/all')}
              icon={<Reorder />}
            >Все</MenuItem>
          </SubMenu>
          <SubMenu label="Задачи"defaultOpen={true}>
            <MenuItem
              component={<Link to={'/tasks/my-all'}/>}
              active={location.pathname.includes('/tasks/my-all')}
              icon={<Reorder />}
            >Мои (все)</MenuItem>
          </SubMenu>
          <SubMenu label="Настройки каталога ИТ-услуг" defaultOpen={true}>
            <MenuItem
              component={<Link to={'/services_catalog/tree'} />}
              active={location.pathname.includes('/services_catalog/tree')}
              icon={<Lan />}
            >Дерево ИТ-услуг</MenuItem>
            <MenuItem
              component={<Link to={'/services_catalog/itcatalog'} />}
              active={location.pathname.includes('/services_catalog/itcatalog')}
              icon={<Storage />}
            >ИТ-услуги</MenuItem>
            <MenuItem
              component={<Link to={'/services_catalog/itservices'} />}
              active={location.pathname.includes('/services_catalog/itservices')}
              icon={<Storage />}
            >Сервисы (ИС)</MenuItem>
            <MenuItem
              component={<Link to={'/services_catalog/history'} />}
              active={location.pathname.includes('/services_catalog/history')}
              icon={<Folder />}
            >История каталога</MenuItem>
          </SubMenu>
          <SubMenu label="Администрирование"></SubMenu>
          <SubMenu label="Справочники" defaultOpen={true}>
            <MenuItem
              component={<Link to={'/directory/groups'} />}
              active={location.pathname.includes('/directory/groups')}
              icon={<Groups />}
            >Группы</MenuItem>
            <MenuItem
              component={<Link to={'/directory/worktypes'} />}
              active={location.pathname.includes('/directory/worktypes')}
              icon={<SettingsSuggest />}
            >Типы работ</MenuItem>
          </SubMenu>
          <SubMenu label="Информация">
            <MenuItem>О системе</MenuItem>
            <MenuItem>Справка о системе</MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </Box>
);
}
