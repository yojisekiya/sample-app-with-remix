// import {
//   Banner,
//   useApi,
//   useTranslate,
//   reactExtension,
// } from '@shopify/ui-extensions-react/checkout';

// export default reactExtension(
//   'purchase.checkout.block.render',
//   () => <Extension />,
// );

// function Extension() {
//   const translate = useTranslate();
//   const { extension } = useApi();

//   return (
//     <Banner title="checkout-ui">
//       {translate('welcome', { target: extension.target })}
//     </Banner>
//   );
// }

import React, { useState } from "react";
import {
  reactExtension,
  TextField,
  useApplyMetafieldsChange,
  useMetafield,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const METAFIELD_NAMESPACE = "RESIDENT_ID_APP";
  const METAFIELD_KEY = "resident_id";
  const [residentID, setResidentID] = useState("");
  const [error, setError] = useState(false);
  const updateMetafield = useApplyMetafieldsChange();
  const residentIdState = useMetafield({
    namespace: METAFIELD_NAMESPACE,
    key: METAFIELD_KEY,
  });
  const handleFieldChange = (value) => {
    if (validateResidentId(value)) {
      updateMetafield({
        type: "updateMetafield",
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        valueType: "string",
        value: value,
      });
      setError(false);
    } else {
      setError(true);
    }
  };

  const validateResidentId = (value) => {
    return value.length === 9;
  };

  return (
    <TextField
      label="Resident ID"
      value={residentIdState?.value}
      error={error ? "Please provide a valid ID" : false}
      onChange={handleFieldChange}
    />
  );
}