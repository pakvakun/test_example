const { axios } = require("./fakeBackend/mock");

const getFeedbackByProductViewData = async (product, actualize = false) => {
    let feedback;
    try {
        feedback = await axios.get(`/feedback?product=${product}`);
        feedback = feedback.data;

        feedback.feedback.map(f => {
            let date = new Date(f.date)
            f.date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
            
            return f
        })

        getUser = async userItem => {
            let usersInfo = await axios('/users', {params: {id: userItem.userId}})
            userItem.user = `${usersInfo.data.users[0].name} (${usersInfo.data.users[0].email})`
            return userItem
        }

        getUsers = async arr => await Promise.all( arr.map(getUser) )

        await getUsers(feedback.feedback);
        
        //sorry for bubble sort 8 ;)
        
        feedback.feedback.sort((a,b) => {
            return new Date(a.date) - new Date(b.date)
        })

        feedback.feedback.length === 0 &&  (feedback.message = 'Отзывов пока нет')

        if (actualize) {

            //Вот именно поэтому я ищу новую работу ;)  очень хочу писать лучше чем то что на 38 - 46 строках ))

            feedback.feedback = feedback.feedback.filter((obj, key) => {
                return feedback.feedback.filter((i, index) => {
                    if (i.userId === obj.userId && key !== index) {
                        if (new Date(i.date) > new Date(obj.date)) {
                            return i
                        }
                    }
                }).length === 0
            })
        }
    } catch (error) {
        feedback = error
        feedback.message = 'Такого продукта не существует'
    }
    return feedback
};

module.exports = { getFeedbackByProductViewData };
