import { Link } from 'react-router-dom';
import PriorityDisplay from './PriorityDisplay';
import ProgressDisplay from './ProgressDisplay';
import StatusDisplay from './StatusDisplay';
import AvatarDisplay from './AvatarDisplay';
import DeleteBlock from './DeleteBlock';

const TicketCard = ({ color, ticket }) => {
  return (
    <div className="ticket-card">
      <div className="ticket-color" style={{ backgroundColor: color }}></div>
      <Link 
        to={`/ticket/${ticket.documentId}`} // Update this path to match your routing
        id="link"
        state={{ editMode: true }} 
        className="link-no-underline" // Pass editMode state here
      >
        <h3>{ticket.title}</h3>
        <AvatarDisplay ticket={ticket} />
        <StatusDisplay status={ticket.status} />
        <PriorityDisplay priority={Number(ticket.priority)} />
        <ProgressDisplay progress={Number(ticket.progress)} />
      </Link>
      <DeleteBlock documentId={ticket.documentId} />
    </div>
  );
}

export default TicketCard;
