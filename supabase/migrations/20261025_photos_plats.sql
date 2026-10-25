-- Les anciennes images des plats étaient des affiches du menu (avec texte et prix).
-- On pointe désormais vers les photos de plats découpées, servies par le site (public/assets/plats).
update public.plats set image_url = case
  when image_url ilike '%sauce-gombo%'      then '/assets/plats/sauce-gombo.jpg'
  when image_url ilike '%sauce-assrokouin%' then '/assets/plats/sauce-assrokouin.jpg'
  when image_url ilike '%sauce-arachide%'   then '/assets/plats/sauce-arachide.jpg'
  when image_url ilike '%sauce-crin-crin%'  then '/assets/plats/sauce-crin-crin.jpg'
  when image_url ilike '%michoui%'          then '/assets/plats/michoui.jpg'
  when image_url ilike '%/Brochettes.%'     then '/assets/plats/brochettes.jpg'
  when image_url ilike '%/Chawarma.%'       then '/assets/plats/chawarma.jpg'
  when image_url ilike '%/Crepes.%'         then '/assets/plats/crepes.jpg'
  when image_url ilike '%/Gaufres.%'        then '/assets/plats/gaufres.jpg'
  when image_url ilike '%/Kebab.%'          then '/assets/plats/kebab.jpg'
  when image_url ilike '%/Pate.%'           then '/assets/plats/pate.jpg'
  when image_url ilike '%/Poisson.%'        then '/assets/plats/poisson.jpg'
  when image_url ilike '%/Poulets.%'        then '/assets/plats/poulets.jpg'
  when image_url ilike '%/Sandwich.%'       then '/assets/plats/sandwich.jpg'
  else image_url
end
where image_url is not null and image_url not like '/assets/plats/%';
