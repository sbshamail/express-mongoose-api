exports.createApi = async (model,data,options={}) => {
    const api = new model(data);
    const response = await api.save(options);
    return response;
}