import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Flare } from '@material-ui/icons';

const titleLineHeight = 1.4
const titleMaxLines = 3

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: theme.spacing(3),
            height: '100%',
        },
        grow: {
            flexGrow: 1,
        },
        control: {
            padding: theme.spacing(2),
        },
        card: {
            width: 1500,
            // height: 250,
        },
        media: {
            height: 100,
        },
        cardContent: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        title: {
            position: 'relative',
            lineHeight: `${titleLineHeight}rem`,
            maxHeight: `${titleMaxLines * titleLineHeight}rem`,
            fontWeight: 500,
            overflow: 'hidden',
            // paddingRight: '1rem' /* space for ellipsis */,

            '&::before': {
                position: 'absolute',
                content: '"..."',
                insetBlockEnd: 0, /* "bottom" */
                insetInlineEnd: 0/* "right" */
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                insetInlineEnd: 0,/* "right" */
                width: `1rem`,
                height: `1rem`,
                background: `#fff`
            }
        },
        tags: {
            marginTop: 40,
            display: 'flex',
            '& > *': {
                margin: theme.spacing(0.5),
                fontSize: 14,
            },
        },
        pos: {
            marginBottom: -5,
        },
        avatarGroup: {
            // margin: "0px 6px"
        },
        // modal: {
        //     position: 'absolute',
        //     top: '40%',
        //     left: '50%',
        //     transform: 'translate(-50%, -50%)',
        //     width: 1200,
        //     backgroundColor: theme.palette.background.paper,
        //     boxShadow: theme.shadows[5],
        //     padding: theme.spacing(2, 4, 3),
        // },
        modal: {
            position: 'fixed',  
            top: '50%',         
            left: '50%',        
            transform: 'translate(-50%, -50%)', 
            width: 1600,        
            height: '80%',      
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            overflow: 'auto',   
            zIndex: 1000,       
        },
        

        taskAContent: {
            backgroundColor: '#f8f2fa', 
            marginTop: 0,
            paddingTop: 0,
            marginBottom: 0,
        },

        taskAstart: {
            fontWeight: 'bold',
            fontSize: '22px',
        },

        fieldsetStyle: {
            backgroundColor: '#fcfbef', 
            marginLeft: '25px',
            marginRight: '80px',
        },

        taskBContent: {
            backgroundColor: '#e3fff9', 
            marginTop: 0,
            paddingTop: 0,
            marginBottom: 0,
        },

        taskBstart: {
            fontWeight: 'bold',
            fontSize: '22px',
        },

        questions: {
            border: '2px solid #ccc', 
            padding: '20px',
            marginTop: '10px',
            backgroundColor: '#f8f2fa', 
        },
        legend: {
            fontWeight: 'bold', 
        },

        buttonGroup: {
            paddingTop: '20px',
            display: 'flex', 
        },
        button: {
            marginTop: 8,
            marginRight: 20,
            color: 'grey', 
            backgroundColor: '#f5f0da', 
            borderRadius: '20px',
            '&:hover': { 
                backgroundColor: '#f5edc9',
                boxShadow: '0px 2px 10px rgba(0,0,0,0.2)' 
            },
            '&:active': { 
                backgroundColor: '#f5edc9',
                boxShadow: '0px 5px 15px rgba(0,0,0,0.3)' 
            }
        },
        sankeyButton: {
            marginTop: 8,
            marginRight: 20,
            padding: '10px 20px', // Increases the button size
            fontSize: '1rem', // Larger text
            color: theme.palette.common.white, 
            backgroundColor: theme.palette.primary.main, 
            borderRadius: '20px',
            '&:hover': { 
                backgroundColor: theme.palette.primary.dark, // Darken on hover
                boxShadow: '0px 2px 10px rgba(0,0,0,0.2)'
            },
            '&:active': { 
                backgroundColor: theme.palette.primary.dark,
                boxShadow: '0px 5px 15px rgba(0,0,0,0.3)'
            }
        }

        // highlight: {
        //     backgroundColor: '#f5db53',
        //     boxShadow: '0px 2px 10px rgba(0,0,0,0.2)',
        //     fontWeight: 'bold'
        // }
        
    })
);