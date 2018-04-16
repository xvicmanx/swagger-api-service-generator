${jsDocText}
export const ${method} = (${method}Payload) => {
  const { ${allParamsText} } = ${method}Payload;
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
