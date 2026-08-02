interface AdminPageHeaderProps {
  title: string;
  description: string;
}

export default function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="admin-header">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
