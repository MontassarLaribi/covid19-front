import { Button, Snackbar } from "@material-ui/core";
import * as React from "react";
export default LoiSnack => {
  const [open, setOpen] = React.useState(true);
  const message =
    'امام التفشي السريع لوباء "فيروس كورونا المستجد" في تونس و في العالم، اصدرامرا حكوميا عدد 152 بتاريخ 13 مارس 2020 يصنف الوباء المذكور ضمن قائمة الامراض السارية عملا بالقانون عدد 71/92 بتاريخ 27 جويلية 1992. تهدف هذه المنصة الى دعم المجهودات المبذولة لمحاربة هذه الجائحة و هي على تواصل مع مصالح وزاجتي الداخلية و الصحة العمومية. كل شخص او جيهة تحاول استعمالها في ما لا يجوز يعرض نفسه لتتبعات جزائية و عقوبات تصل الى السجن و ذلك عملا بأحكام المجلة الجزائية والقانون عدد 71/92 بتاجيخ 27 جويلية 1992 المتعلق بالامراض السارية المعدّل بالمرسوم عدد 152/2020 بتاريخ 13 مارس 2020.' +
    "\nFace à la propagation rapide du covid-19 en Tunisie et dans le monde, le gouvernement a décidé, par le décret n°152 du 13 mars 2020, d’ajouter ce virus à la liste des maladies transmissibles citée par la loi n°71-1992 du 27 juillet 1992. Cette plateforme vise à porter soutien à la lutte contre la pandémie du covid-19 et est en lien direct avec les ministères de l’Intérieur et de la Santé Publique. Encombrer cette plateforme équivaut à commettre un délit pénal. Toute personne qui tente d’en détourner l’usage s’expose à des poursuites pénales et des peines d’emprisonnement conformément aux dispositions du Code pénal et de la Loi n°71-92 du 27 juillet 1992 relative aux maladies transmissibles, telle que modifiée par la Décret n°152-2020 du 13 mars 2020.";
  const action = (
    <Button onClick={handleCloseMessage} color="secondary" size="small">
      Fermer
    </Button>
  );

  function handleCloseMessage() {
    setOpen(false);
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      key={`bottom,right`}
      style={{ maxWidth: "30%" }}
      open={open}
      action={action}
      // onClose={handleClose}
      message={message}
    />
  );
};
