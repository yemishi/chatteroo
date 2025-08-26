import Popover from "@/components/popover/Popover";
import type { ChatMember } from "@/types";
import "./styles.scss";
type Props = {
  member: ChatMember;
  isOpen: boolean;
  onClose: () => void;
};
export default function ChatViewMember({ member, isOpen, onClose }: Props) {
  return (
    <Popover className="center view-member__popover" variant="secondary" isOpen={isOpen} onClose={onClose}>
      <div className="view-member__details">
        <figure className="view-member__figure">
          <img src={member.picture} alt={`Profile picture of ${member.username}`} className="view-member__icon" />
          <figcaption className="view-member__name-tag">
            <h3 className="view-member__username">{member.username}</h3>
            <p className="view-member__tag">{member.tag}</p>
          </figcaption>
        </figure>

        <div className="view-member__info">
          {member.bio && <p className="view-member__bio">{member.bio}</p>}
          {member.email && (
            <p className="view-member__email">
              <a href={`mailto:${member.email}`}>{member.email}</a>
            </p>
          )}
          {member.guestCode && <p className="view-member__guest-code">{member.guestCode}</p>}
        </div>
      </div>
    </Popover>
  );
}
