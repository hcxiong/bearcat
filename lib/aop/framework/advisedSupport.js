/**
 * .______    _______     ___      .______       ______     ___   .__________.
 * |   _  )  |   ____)   /   \     |   _  )     (      )   /   \  (          )
 * |  |_)  ) |  |__     /  ^  \    |  |_)  )   |  ,----'  /  ^  \ `---|  |---`
 * |   _  <  |   __)   /  /_\  \   |      )    |  |      /  /_\  \    |  |
 * |  |_)  ) |  |____ /  _____  \  |  |)  ----.|  `----./  _____  \   |  |
 * |______)  |_______/__/     \__\ | _| `.____) (______)__/     \__\  |__|
 *
 * Bearcat AdvisedSupport
 * Copyright(c) 2014 fantasyni <fantasyni@163.com>
 * MIT Licensed
 */

/**
 * AdvisedSupport constructor function.
 * @api public
 */
var AdvisedSupport = function() {
	this.advisors = [];
	this.interfaces = [];
	this.methodCache = {};
	this.beanFactory = null;
	this.targetSource = null;
	this.advisorChainFactory = null;
}

module.exports = AdvisedSupport;

/**
 * set target.
 *
 * @param  {Object} target object
 * @api public
 */
AdvisedSupport.prototype.setTarget = function(target) {
	this.setTargetSource(target);
}

/**
 * set target source.
 *
 * @param  {Object} targetSource object
 * @api public
 */
AdvisedSupport.prototype.setTargetSource = function(targetSource) {
	this.targetSource = targetSource;
}


AdvisedSupport.prototype.getTargetSource = function() {
	return this.targetSource;
}

/**
 * set proxy interfaces.
 *
 * @param  {Array} proxy interfaces
 * @api public
 */
AdvisedSupport.prototype.setInterfaces = function(interfaces) {
	this.interfaces = interfaces;
}

/**
 * add proxy interface.
 *
 * @param  {String} proxy interface
 * @api public
 */
AdvisedSupport.prototype.addInterface = function(interface) {
	this.interfaces.push(interface);
}

AdvisedSupport.prototype.getInterfaces = function() {
	return this.interfaces;
}

AdvisedSupport.prototype.getAdvisors = function() {
	return this.advisors;
}

/**
 * add advisor.
 *
 * @param  {Object} advisor
 * @api public
 */
AdvisedSupport.prototype.addAdvisor = function(advisor) {
	this.advisors.push(advisor);
}

/**
 * get beanFactory.
 *
 * @return  {Object} beanFactory object
 * @api public
 */
AdvisedSupport.prototype.getBeanFactory = function() {
	return this.beanFactory;
}

/**
 * set beanFactory.
 *
 * @param  {Object} beanFactory object
 * @api public
 */
AdvisedSupport.prototype.setBeanFactory = function(beanFactory) {
	this.beanFactory = beanFactory;
}

AdvisedSupport.prototype.getInterceptionAdvice = function(method, beanName, adviceType) {
	var cacheKey = method + "_" + adviceType;
	var cached = this.methodCache[cacheKey];

	if (!cached) {
		cached = this.doGetInterceptionAdvice(method, beanName, adviceType);
		this.methodCache[cacheKey] = cached;
	}

	return cached;
}

AdvisedSupport.prototype.doGetInterceptionAdvice = function(method, beanName, adviceType) {
	var interceptorList = [];
	var advisors = this.getAdvisors();
	var targetMethod = beanName + '.' + method;

	for (var i = 0; i < advisors.length; i++) {
		var advisor = advisors[i];
		var pointcut = advisor.getPointcut();
		if (pointcut.getAdviceType() !== adviceType) {
			continue;
		}

		if (pointcut.match(targetMethod)) {
			interceptorList.push(advisor);
		}
	}

	return interceptorList;
}