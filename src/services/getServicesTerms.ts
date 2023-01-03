const getServicesTerms = async(data: any) => {
  try {
    const resp = await fetch(window.wp_pageviews_ajax.ajax_url, {
      method: 'POST',
      credentials: 'same-origin',
      body: data,
    })
    const terms = await resp.json()
    // eslint-disable-next-line no-debugger

    return terms
  } catch (error) {
    return error
  }
}
export default getServicesTerms