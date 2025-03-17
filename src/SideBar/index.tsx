import React, { useState } from "react";

const COLORS = ["#569c8e", "#dbb651", "#6abae6", "#c9a3cc", "#e8e4b5"]
import {
    Drawer,
    Divider,
    Toolbar,
    Chip,
    Typography,
    InputBase,
    Avatar,
    Tooltip,
    Menu,
    MenuItem,
    Button,
    Hidden,
    Popover
} from "@material-ui/core";
import { Search as SearchIcon, LaunchOutlined as LaunchIcon } from "@material-ui/icons";
import Select from '@material-ui/core/Select';

import { useStyles } from "./style";

import { ChartModal } from '../ChartModal'
import { List } from "echarts";
import { basePath } from "..";

export const getAvatar = (s: string) => {
    const pieces = s.split("_");
    if (pieces.length == 2) {
        return `${pieces[0][0].toUpperCase()}${pieces[0][1].toUpperCase()}${pieces[1][0].toUpperCase()}`;
    } else if (pieces.length > 2 && pieces[1] == 'and') {
        return `${pieces[0][0].toUpperCase()}${pieces[2][0].toUpperCase()}`;
    } else if (pieces.length > 2 && pieces[2] == 'and') {
        return `${pieces[0][0].toUpperCase()}${pieces[1][0].toUpperCase()}`;
    } else if (pieces.length == 0) {
        return '-'
    }
    return `${pieces[0][0].toUpperCase()}`;
};


interface Props {
    paperNumber: number;
    version: string;
    colors: string[];
    tags: Record<string, Record<string, boolean>>;
    tagFilters: Record<string, Record<string, boolean>>;
    paperYear: Record<string, number>;
    paperArea: Record<string, number>;
    tagCounts: Record<string, number>;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
    onClickFilter: (tag: string, type: string) => void;
    onSetSearchKey: (key: string) => void;
    onSetVersion: (version: string) => void;
}

export function SideBar(props: Props) {
    const { paperNumber, colors, tags, tagFilters, onClickFilter, onSetSearchKey, onSetVersion, paperArea, paperYear, tagCounts, mobileOpen, handleDrawerToggle } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const classes = useStyles();
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };



    const getBgColor = (tag: string) => {
        const index = Object.keys(props.tags).indexOf(tag)
        if (colors) {
            return colors[index]
        }
        return COLORS[index]
    }



    const AvatarComponent = ({ tag, bgcolor, typeName }) => {
        const avatarSrc = `${basePath}/assets/avatars/${typeName}_${tag}.png`; 
        return (
            <Avatar alt={getAvatar(tag)} src={avatarSrc} style={{ width: 24, height: 24, marginLeft: 6, backgroundColor: bgcolor, color: "white", border: "1px solid white" }}><b style={{ fontSize: '0.75rem' }}>{getAvatar(tag)}</b></Avatar>
        );
    };


    // Hover for instruction
    const tags_keys = Object.keys(tags)
    const typeDescriptions = {
        [tags_keys[0]]: [
          "Intrapersonal (conflicts within the individual)-Highlight inner dilemmas or personal value struggles",
          "Interpersonal (conflicts between individuals)-Conflicts in personal relationships, workplace situations, or between friends.",
          "Group (conflicts within or between groups)-Group of people (such as coworkers, family members, or social groups) have a value clash. These often involve collective decision-making where competing group values must be reconciled."
        ],
        [tags_keys[1]]: [
          "Social Contexts refer to the various environments or settings where interactions occur"
        ],
        [tags_keys[2]]: [
          "Implicit: there is a time constraint associated with the consequence of the scenario",
          "Explicit: there's an actual deadline in the scenario"
        ],
        [tags_keys[3]]: [
            "mild : Suffer hardly any consequences",
            "medium : Suffer some consequences which can be tolerated",
            "high : I will suffer extreme consequences"
        ]
    };

    const renderDescriptionList = (typeName) => {
        if (!typeDescriptions[typeName] || typeDescriptions[typeName].length === 0) {
          return "No description available"; 
        }
        return (
          <ul>
            {typeDescriptions[typeName].map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        );
      };
      

    const renderFilters = (typeName: string) => {
        const tagsCollection = props.tagFilters[typeName];
        return (
            <div key={typeName}>
                {/* <Typography variant="subtitle2" className={classes.filterTitle}>
                    {typeName} : <Button variant="outlined" size="small" onClick={() => onClickFilter("all", typeName)}>{Object.values(tagsCollection).every(d => d) ? 'Unselect All' : 'Select All'}</Button>
                </Typography> */}
                {/* <Tooltip title={renderDescriptionList(typeName)} classes={{ tooltip: classes.tooltip }}>
                    <Typography variant="subtitle2" className={classes.filterTitle}>
                        <span style={{ textDecoration: 'underline' }}>{typeName}</span> : <Button variant="outlined" size="small" onClick={() => onClickFilter("all", typeName)}>{Object.values(tagsCollection).every(d => d) ? 'Unselect All' : 'Select All'}</Button>
                    </Typography>
                </Tooltip> */}
                <Typography variant="subtitle2" className={classes.filterTitle}>
                    <Tooltip title={renderDescriptionList(typeName)} classes={{ tooltip: classes.tooltip }}>
                        <span style={{ textDecoration: 'underline' }}>{typeName}</span>
                    </Tooltip>
                    ： 
                    <Button variant="outlined" size="small" onClick={() => onClickFilter("all", typeName)}>
                        {Object.values(tagsCollection).every(d => d) ? 'Unselect All' : 'Select All'}
                    </Button>
                </Typography>

                <div className={classes.filters}>
                    {Object.entries(tagsCollection).map(([tag, checked]) => (
                        <Chip
                            key={tag}
                            // avatar={<AvatarComponent tag={tag} typeName={typeName} bgcolor={getBgColor(typeName)} />}
                            label={tag}
                            clickable
                            variant={checked ? "default" : "outlined"}
                            style={{
                                backgroundColor: checked ? getBgColor(typeName) : 'transparent',
                                color: checked ? 'white' : getBgColor(typeName),
                            }}
                            onClick={() => onClickFilter(tag, typeName)}
                        />
                    ))}
                </div>
                <Divider />
            </div>
        );
    };
    console.log("tagfilters", tagFilters['Conflict Type']["Intrapersonal_Narrow"])

    const drawer = <div className={classes.drawerContainer}>
        <Toolbar />

        <Typography variant="h5" className={classes.paperNumber}>
            Scenarios: {paperNumber}
        </Typography>

        <Divider />

        <Typography variant="subtitle2" className={classes.filterTitle}>
            Keywords search:
        </Typography>

        <div className={classes.search}>
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                placeholder="Search…"
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={(event) => onSetSearchKey(event.target.value)}
            />
        </div>

        <Divider />
        {/* < ChartModal
            paperYear={paperYear}
            paperArea={paperArea}
            tagCounts={tagCounts}
        />
        <Divider /> */}
        <Typography className={classes.conflictInstruction}>
            {/* "Intrapersonal (conflicts within the individual): View as a first person perspective"<br />
            "Interpersonal (conflicts between individuals): View as a third person perspective"<br />
            "Group (conflicts within or between groups): View as a third person perspective" */}
            {(tagFilters['Conflict Type']["Intrapersonal_Narrow"] || tagFilters['Conflict Type']["Intrapersonal_Broad"]) && "Intrapersonal (conflicts within the individual): This analysis is first person perspective, where you consider the situation as though you are in the position of the person experiencing the conflict."}<br />
            {(tagFilters['Conflict Type']["Interpersonal_Narrow"] || tagFilters['Conflict Type']["Interpersonal_Broad"]) && "Interpersonal (conflicts between individuals): The analysis should be from a third person perspective where both people’s conflicting values should be considered."}<br />
            {(tagFilters['Conflict Type']["Group_Narrow"] || tagFilters['Conflict Type']["Group_Broad"]) && "Group (conflicts within or between groups): The analysis should be from third person perspective where both group’s conflicting values should be considered."}<br />      
        </Typography>

        <Typography className={classes.conflictInstruction2}>
            "Narrow: Typically no extended backstory or few compounding factors; the scenario is short and direct."<br />
            "Broad: Extended background, multiple stakeholders, or deep emotional stakes."       
        </Typography>

        <Divider />

        {Object.keys(tagFilters).map((typeName) => renderFilters(typeName))}

        <Divider />

    </div>

    return (<>
        <Hidden smUp implementation="css">
            {/* this drawer is for the mobile mode */}
            <Drawer
                variant="temporary"
                anchor={'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                {drawer}
            </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
            <Drawer
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
            >
                {drawer}
            </Drawer>
        </Hidden>
    </>
    );
}
