import { SERVICES } from './homeServicesData';

export default function ServicesGrid() {
  return (
    <section className="rp-grid-3">
      {SERVICES.map((service) => (
        <article className="rp-card" key={service.id}>
          <img src={service.image} alt={service.title} className="rp-product-card" />
          <div className="rp-card-body">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
