${jsDocText}
export const ${method} = (${method}Payload) => {
  throwIfAnyMissing([${allRequiredKeysParamsText}], ${method}Payload);
  const { ${allButHeaderParamsText} } = ${method}Payload;
  return request.${requestMethod}(
    endpoints.${endName}({ ${pathParamsText} }),
    {
      query: notEmptyProps({ ${queryParamsText} }),
      body: ${bodyParamsText},
      form: { ${formsParamsText} },
      headers: {${headersText}},
    },
    '${contentType}'
  ).then(response => response.${transformMethodText}());
};
