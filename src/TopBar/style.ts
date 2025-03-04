import { createStyles, Theme, makeStyles, fade } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
              display: 'none',
            },
        },
        title: {
            flexGrow: 1,
          },
        sectionDesktop: {
            // display: 'none',
            // [theme.breakpoints.up('md')]: {
            //     display: 'flex',
            // },
        },
        iconName: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'inherit',
              },
        },
        instructionModal: {
            position: 'fixed',  
            top: '50%',         
            left: '50%',        
            transform: 'translate(-50%, -50%)', 
            width: 1200,        
            height: '70%',      
            backgroundColor: '#fcf8e8',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            overflow: 'auto',   
            zIndex: 1000, 
        }
    })
);