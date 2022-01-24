import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

// prettier-ignore
import {
    faPhone, faUser, faFlag, faThumbsUp, faThumbsDown, faCheckCircle, faTimesCircle, faTimes, faCheck,
    faFolder, faCrown, faQuestionCircle, faNewspaper, faUsers, faPenAlt, faUserCog, faUpload, faComments,
    faColumns, faHome, faVial, faComment, faHistory, faHourglass, faBars, faSignInAlt, faUserShield, faKey,
    faInfoCircle, faChevronDown, faChevronUp, faChevronLeft, faChevronRight, faStar, faCommentAlt, faEdit,
    faHourglassEnd, faSearch, faCog, faSignOutAlt, faCamera, faWind, faExclamationCircle, faHashtag,
    faParagraph, faBold, faItalic, faStrikethrough, faUnderline, faHighlighter, faTrash, faStopwatch,
    faTags, faShareSquare, faAward, faMedal, faEnvelope, faUniversalAccess, faUserFriends, faAddressCard,
    faExternalLinkAlt, faFileUpload, faCloudUploadAlt, faCloudDownloadAlt, faList, faTh, faEllipsisH,
    faDownload, faPlus, faTools, faToolbox, faBookmark, faPaperPlane, faFile, faTerminal, faCalculator,
    faLeaf, faBolt, faBook, faSadCry, faGrimace, faGrinBeamSweat, faDizzy, faSurprise, faExclamation,
    faInfo, faSpinner, faArrowDown, faArrowRight, faLink, faSlidersH,
} from '@fortawesome/free-solid-svg-icons'

// prettier-ignore
import {
    faFlag as farFlag, faHourglass as farHourglass, faStar as farStar, faComment as farComment,
    faCommentAlt as farCommentAlt, faEdit as farEdit, faThumbsUp as farThumbsUp,
    faThumbsDown as farThumbsDown,
} from '@fortawesome/free-regular-svg-icons'
import {
    faReddit,
    faFacebook,
    faDiscord,
    faLinkedin,
    faInstagram,
    faGithub,
} from '@fortawesome/free-brands-svg-icons'

// Solid icons
// prettier-ignore
library.add(faPhone, faUser, faFlag, faThumbsUp, faThumbsDown, faCheckCircle, faTimesCircle, faCheck,
    faTimes, faFolder, faCrown, faQuestionCircle, faFolder, faNewspaper, faUsers, faPenAlt, faUserCog,
    faUpload, faComments, faColumns, faHome, faVial, faComment, faHistory, faHourglass, faBars, faSignInAlt,
    faUserShield, faKey, faInfoCircle, faChevronDown, faChevronUp, faChevronLeft, faChevronRight, faStar,
    faFlag, faCommentAlt, faEdit, faHourglassEnd, faSearch, faCog, faSignOutAlt, faCamera, faWind,
    faExclamationCircle, faHashtag, faParagraph, faBold, faItalic, faStrikethrough, faUnderline,
    faHighlighter, faTrash, faStopwatch, faTags, faShareSquare, faAward, faMedal, faEnvelope,
    faUniversalAccess, faUserFriends, faAddressCard, faExternalLinkAlt, faFileUpload, faCloudUploadAlt,
    faCloudDownloadAlt, faList, faTh, faEllipsisH, faDownload, faPlus, faToolbox, faTools, faBookmark,
    faInfoCircle, faPaperPlane, faFile, faTerminal, faCalculator, faLeaf, faBolt, faBook, faSadCry,
    faGrimace, faGrinBeamSweat, faDizzy, faSurprise, faExclamation, faInfo, faSpinner, faArrowDown,
    faArrowRight, faLink, faSlidersH)

// Regular icons
library.add(farFlag, farHourglass, farStar, farComment, farCommentAlt, farEdit, farThumbsUp, farThumbsDown)

// Brand icons
library.add(faReddit, faFacebook, faDiscord, faLinkedin, faInstagram, faGithub)

export default FontAwesomeIcon
