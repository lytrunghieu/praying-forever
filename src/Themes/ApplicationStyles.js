import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {

    button :{
      container :{
          height : 84,
          justifyContent:"center"
      },
        shadowCenter :{
            shadowOffset: {
                height: 2,
                width : 2,
            },
            shadowRadius: 2,
            shadowColor: Colors.black,
            shadowOpacity: 1,
            elevation: 1
        }
    },

    screen: {
        mainContainer: {
            flex: 1,
            backgroundColor: Colors.transparent
        },

        mainContainerWithBackgroundColor:{
            flex: 1,
            backgroundColor: Colors.grayBg
        },

        shadowContainer :{
            shadowOffset: {
                height: 2,
            },
            shadowRadius: 2,
            shadowColor: Colors.black,
            shadowOpacity: 1,
            elevation: 1
        },

        shadowContainerUp :{
            shadowOffset: {
                height: -1,
            },
            shadowRadius: 2,
            shadowColor: Colors.black,
            shadowOpacity: 1,
            elevation: 1
        }

        // rowItemContainer: {
        //     width : "1"
        // }

        //   backgroundImage: {
        //     position: 'absolute',
        //     top: 0,
        //     left: 0,
        //     bottom: 0,
        //     right: 0
        //   },
        //   container: {
        //     flex: 1,
        //     paddingTop: Metrics.baseMargin,
        //     backgroundColor: Colors.transparent
        //   },
        //   section: {
        //     margin: Metrics.section,
        //     padding: Metrics.baseMargin
        //   },
        //   sectionText: {
        //     ...Fonts.style.normal,
        //     paddingVertical: Metrics.doubleBaseMargin,
        //     color: Colors.snow,
        //     marginVertical: Metrics.smallMargin,
        //     textAlign: 'center'
        //   },
        //   subtitle: {
        //     color: Colors.snow,
        //     padding: Metrics.smallMargin,
        //     marginBottom: Metrics.smallMargin,
        //     marginHorizontal: Metrics.smallMargin
        //   },
        //   titleText: {
        //     ...Fonts.style.h2,
        //     fontSize: 14,
        //     color: Colors.text
        //   }
        // },
        // darkLabelContainer: {
        //   padding: Metrics.smallMargin,
        //   paddingBottom: Metrics.doubleBaseMargin,
        //   borderBottomColor: Colors.border,
        //   borderBottomWidth: 1,
        //   marginBottom: Metrics.baseMargin
        // },
        // darkLabel: {
        //   fontFamily: Fonts.type.bold,
        //   color: Colors.snow
        // },
        // groupContainer: {
        //   margin: Metrics.smallMargin,
        //   flexDirection: 'row',
        //   justifyContent: 'space-around',
        //   alignItems: 'center'
        // },
        // sectionTitle: {
        //   ...Fonts.style.h4,
        //   color: Colors.coal,
        //   backgroundColor: Colors.ricePaper,
        //   padding: Metrics.smallMargin,
        //   marginTop: Metrics.smallMargin,
        //   marginHorizontal: Metrics.baseMargin,
        //   borderWidth: 1,
        //   borderColor: Colors.ember,
        //   alignItems: 'center',
        //   textAlign: 'center'
    }
}

export default ApplicationStyles
