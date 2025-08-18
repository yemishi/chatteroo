import "./styles.scss";
export const ProfileOption = ({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <div className="profile-option" onClick={onClick}>
    <h3 className="profile-option__title">{title}</h3>
    <p className="profile-option__label">{description}</p>
  </div>
);
