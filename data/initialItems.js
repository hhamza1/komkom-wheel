import porteMonnaieImage from '../assets/gifts/porte-monnaie.png';
import sacPoubelleImage from '../assets/gifts/sac-poubelle.png';
import gantsImage from '../assets/gifts/gants.png';
import impermeableMoovImage from '../assets/gifts/impermeable-moov.png';
import supportPhoneImage from '../assets/gifts/support-phone.png';
import casquetteMoovImage from '../assets/gifts/casquette-moov.png';
import cahierMoovImage from '../assets/gifts/cahier-moov.png';
import briquetMoovImage from '../assets/gifts/briquet-moov.png';

export const initialItems = [
  { name: "Ballon de foot", logo: "futbol", quantity: 0, image: null },
  { name: "Trousse de 1er secours", logo: "first-aid", quantity: 0, image: null },
  { name: "Porte monnaie pour les voitures et taxis", logo: "wallet", quantity: 0, image: porteMonnaieImage },
  { name: "Sac poubelle qu'on accroche dans la vitesse", logo: "trash", quantity: 0, image: sacPoubelleImage },
  { name: "Gants de protection solaire", logo: "hand-paper", quantity: 0, image: gantsImage },
  { name: "Impermeable", logo: "vest", quantity: 0, image: impermeableMoovImage },
  { name: "Capuchon", logo: "hat-wizard", quantity: 0, image: null },
  { name: "Support téléphone", logo: "mobile-alt", quantity: 0, image: supportPhoneImage },
  { name: "Cache soleil avec ventouse", logo: "sun", quantity: 0, image: null },
  { name: "Casquette", logo: "hat-cowboy", quantity: 20, image: casquetteMoovImage },
  { name: "Porte clé", logo: "key", quantity: 0, image: null },
  { name: "Cahier", logo: "notebook", quantity: 20, image: cahierMoovImage },
  { name: "Briquet", logo: "fire", quantity: 20, image: briquetMoovImage }
];
